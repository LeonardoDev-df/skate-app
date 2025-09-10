"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SkateparkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkateparkService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let SkateparkService = SkateparkService_1 = class SkateparkService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.logger = new common_1.Logger(SkateparkService_1.name);
    }
    async findAll() {
        try {
            const skateparks = await this.firebaseService.getAllDocuments('SkatePark');
            this.logger.debug(`Encontrados ${skateparks.length} documentos na coleção SkatePark`);
            const formattedParks = [];
            skateparks.forEach(park => {
                this.logger.debug(`Processando park: ${park.id}`, park);
                if (park.Spot && Array.isArray(park.Spot) && park.Spot.length > 0) {
                    const spotData = park.Spot[0];
                    if (spotData && spotData.Brasilia && Array.isArray(spotData.Brasilia)) {
                        this.logger.debug(`Encontrados ${spotData.Brasilia.length} spots em Brasília`);
                        spotData.Brasilia.forEach((spot, index) => {
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
        }
        catch (error) {
            this.logger.error('Erro ao buscar skateparks:', error);
            return {
                skateparks: [],
                count: 0,
                error: 'Erro ao buscar skateparks'
            };
        }
    }
    async findOne(id) {
        try {
            const all = await this.findAll();
            const park = all.skateparks.find(p => p.id === id);
            if (!park) {
                throw new common_1.NotFoundException(`Skatepark com ID '${id}' não encontrado`);
            }
            return {
                skatepark: park,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            this.logger.error(`Erro ao buscar skatepark ${id}:`, error);
            throw error;
        }
    }
    async findByCity(city) {
        try {
            this.logger.debug(`Buscando skateparks por cidade: "${city}"`);
            const all = await this.findAll();
            const normalizeString = (str) => {
                return str
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, ' ');
            };
            const normalizedSearchCity = normalizeString(city);
            this.logger.debug(`Cidade normalizada para busca: "${normalizedSearchCity}"`);
            const filtered = all.skateparks.filter(park => {
                const normalizedParkCity = normalizeString(park.city);
                const normalizedParkName = normalizeString(park.name);
                const normalizedState = normalizeString(park.state || '');
                const matches = normalizedParkCity.includes(normalizedSearchCity) ||
                    normalizedParkName.includes(normalizedSearchCity) ||
                    normalizedState.includes(normalizedSearchCity) ||
                    normalizedSearchCity.includes(normalizedParkCity) ||
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
        }
        catch (error) {
            this.logger.error(`Erro ao buscar skateparks por cidade "${city}":`, error);
            return {
                skateparks: [],
                count: 0,
                error: `Erro ao buscar skateparks por cidade "${city}"`
            };
        }
    }
    extractCoordinatesFromUrl(url) {
        try {
            const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return {
                    lat: parseFloat(match[1]),
                    lng: parseFloat(match[2]),
                    source: 'extracted'
                };
            }
            return this.getCoordinatesByName(url);
        }
        catch (error) {
            this.logger.warn(`Erro ao extrair coordenadas de ${url}:`, error);
            return this.getDefaultCoordinates();
        }
    }
    getCoordinatesByName(address) {
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
    getDefaultCoordinates() {
        return {
            lat: -15.7801,
            lng: -47.9292,
            source: 'default'
        };
    }
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
        }
        catch (error) {
            return {
                error: 'Erro ao fazer debug',
                details: error.message
            };
        }
    }
};
exports.SkateparkService = SkateparkService;
exports.SkateparkService = SkateparkService = SkateparkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SkateparkService);
//# sourceMappingURL=skatepark.service.js.map