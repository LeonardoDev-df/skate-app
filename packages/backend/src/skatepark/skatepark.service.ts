import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

interface SkateparkSpot {
  City: string;
  Adress: string;
}

interface SkateparkData {
  id: string;
  Spot?: Array<{
    Brasilia?: SkateparkSpot[];
  }>;
  [key: string]: any;
}

@Injectable()
export class SkateparkService {
  private readonly logger = new Logger(SkateparkService.name);

  constructor(private firebaseService: FirebaseService) {}

  async findAll() {
    try {
      const skateparks = await this.firebaseService.getAllDocuments('SkatePark') as SkateparkData[];
      
      this.logger.debug(`Encontrados ${skateparks.length} documentos na coleção SkatePark`);
      
      const formattedParks = [];
      
      skateparks.forEach(park => {
        this.logger.debug(`Processando park: ${park.id}`, park);
        
        // Verificar se tem a estrutura: Spot[0].Brasilia
        if (park.Spot && Array.isArray(park.Spot) && park.Spot.length > 0) {
          const spotData = park.Spot[0];
          
          if (spotData && spotData.Brasilia && Array.isArray(spotData.Brasilia)) {
            this.logger.debug(`Encontrados ${spotData.Brasilia.length} spots em Brasília`);
            
            spotData.Brasilia.forEach((spot: SkateparkSpot, index: number) => {
              const formattedPark = {
                id: `${park.id}_${index}`,
                name: spot.City,
                address: spot.Adress,
                city: 'Brasília',
                state: 'DF',
                country: 'Brasil',
                type: 'skatepark',
                coordinates: this.extractCoordinatesFromUrl(spot.Adress),
                originalData: {
                  firebaseId: park.id,
                  spotIndex: index
                }
              };
              
              formattedParks.push(formattedPark);
              this.logger.debug(`Adicionado skatepark: ${spot.City}`);
            });
          }
        }
      });

      this.logger.log(`Total de skateparks formatados: ${formattedParks.length}`);
      
      return {
        skateparks: formattedParks,
        count: formattedParks.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Erro ao buscar skateparks:', error);
      return {
        skateparks: [],
        count: 0,
        error: 'Erro ao buscar skateparks'
      };
    }
  }

  async findOne(id: string) {
    try {
      const all = await this.findAll();
      const park = all.skateparks.find(p => p.id === id);
      
      if (!park) {
        throw new NotFoundException(`Skatepark com ID '${id}' não encontrado`);
      }
      
      return {
        skatepark: park,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar skatepark ${id}:`, error);
      throw error;
    }
  }

  async findByCity(city: string) {
    try {
      this.logger.debug(`Buscando skateparks por cidade: "${city}"`);
      
      const all = await this.findAll();
      
      // Função para normalizar strings (remover acentos, espaços extras, converter para lowercase)
      const normalizeString = (str: string): string => {
        return str
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/\s+/g, ' '); // Normaliza espaços
      };
      
      const normalizedSearchCity = normalizeString(city);
      this.logger.debug(`Cidade normalizada para busca: "${normalizedSearchCity}"`);
      
      const filtered = all.skateparks.filter(park => {
        const normalizedParkCity = normalizeString(park.city);
        const normalizedParkName = normalizeString(park.name);
        const normalizedState = normalizeString(park.state || '');
        
        const matches = 
          normalizedParkCity.includes(normalizedSearchCity) || 
          normalizedParkName.includes(normalizedSearchCity) ||
          normalizedState.includes(normalizedSearchCity) ||
          // Busca parcial no nome da cidade
          normalizedSearchCity.includes(normalizedParkCity) ||
          // Busca por palavras-chave
          (normalizedSearchCity === 'brasilia' && normalizedParkCity === 'brasilia') ||
          (normalizedSearchCity === 'df' && normalizedState === 'df');
        
        if (matches) {
          this.logger.debug(`Match encontrado: ${park.name} (${park.city})`);
        }
        
        return matches;
      });
      
      this.logger.log(`Encontrados ${filtered.length} skateparks para cidade "${city}"`);
      
      return {
        skateparks: filtered,
        count: filtered.length,
        searchTerm: city,
        normalizedSearchTerm: normalizedSearchCity,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar skateparks por cidade "${city}":`, error);
      return {
        skateparks: [],
        count: 0,
        error: `Erro ao buscar skateparks por cidade "${city}"`
      };
    }
  }

  private extractCoordinatesFromUrl(url: string) {
    try {
      // Tentar extrair coordenadas do Google Maps URL
      // Formatos possíveis:
      // https://maps.app.goo.gl/... (pode redirecionar)
      // https://www.google.com/maps/@-15.7801,-47.9292,17z
      // https://maps.google.com/maps?q=-15.7801,-47.9292
      
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          source: 'extracted'
        };
      }
      
      // Se não conseguir extrair, usar coordenadas específicas por nome
      return this.getCoordinatesByName(url);
      
    } catch (error) {
      this.logger.warn(`Erro ao extrair coordenadas de ${url}:`, error);
      return this.getDefaultCoordinates();
    }
  }

  private getCoordinatesByName(address: string) {
    // Coordenadas aproximadas dos skateparks conhecidos em Brasília
    const knownLocations = {
      'paranoa': { lat: -15.7801, lng: -47.9292 },
      'deck sul': { lat: -15.8267, lng: -47.9218 },
      'sao sebastiao': { lat: -15.9058, lng: -47.7797 },
      'sebastiao': { lat: -15.9058, lng: -47.7797 }
    };
    
    const normalizedAddress = address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    for (const [key, coords] of Object.entries(knownLocations)) {
      if (normalizedAddress.includes(key)) {
        return {
          ...coords,
          source: 'approximated'
        };
      }
    }
    
    return this.getDefaultCoordinates();
  }

  private getDefaultCoordinates() {
    return {
      lat: -15.7801,
      lng: -47.9292,
      source: 'default' // Centro de Brasília
    };
  }

  // Método adicional para debug
  async debugSkateparks() {
    try {
      const rawData = await this.firebaseService.getAllDocuments('SkatePark');
      
      return {
        message: 'Debug dos dados brutos do Firebase',
        rawData,
        count: rawData.length,
        structure: rawData.map(item => ({
          id: item.id,
          hasSpot: !!item.Spot,
          spotLength: item.Spot?.length || 0,
          hasBrasilia: !!(item.Spot?.[0]?.Brasilia),
          brasiliaLength: item.Spot?.[0]?.Brasilia?.length || 0
        }))
      };
    } catch (error) {
      return {
        error: 'Erro ao fazer debug',
        details: error.message
      };
    }
  }
}