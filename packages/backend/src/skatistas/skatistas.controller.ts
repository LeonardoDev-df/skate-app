import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,  // ✅ Adicionar este import
  Body, 
  Param, 
  UseGuards, 
  Request, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface CreateSkatistaDto {
  uid?: string;
  email: string;
  name: string;
  image?: string;
  invitation?: any;
  spots?: any[];
  status?: 'Online' | 'Offline';
}

interface UpdateSkatistaDto {
  name?: string;
  image?: string;
  spots?: any[];
  status?: 'Online' | 'Offline';
}

@Controller('skatistas')
export class SkatistasController {
  constructor(private firebaseService: FirebaseService) {}

  @Get()
  async findAll() {
    try {
      const skatistas = await this.firebaseService.getAllDocuments('Skatistas');
      return {
        skatistas,
        total: skatistas.length
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar skatistas');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const doc = await this.firebaseService.getDocument('Skatistas', id);
      if (!doc.exists) {
        throw new NotFoundException('Skatista não encontrado');
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar skatista');
    }
  }

  @Post()
  async create(@Body() createData: CreateSkatistaDto) {
    try {
      // Usar o UID fornecido ou gerar um ID único
      const documentId = createData.uid || `skatista_${Date.now()}`;
      
      const skatistaData = {
        uid: documentId,
        email: createData.email,
        name: createData.name,
        image: createData.image || 'sk10.jpg',
        invitation: createData.invitation || null,
        spots: createData.spots || [],
        status: createData.status || 'Online',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Criar documento com ID específico
      await this.firebaseService.createDocument('Skatistas', skatistaData, documentId);
      
      return {
        message: 'Skatista criado com sucesso',
        id: documentId,
        skatista: skatistaData
      };
    } catch (error) {
      console.error('Erro ao criar skatista:', error);
      throw new BadRequestException('Erro ao criar skatista');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateData: UpdateSkatistaDto, @Request() req) {
    try {
      const requestingUser = req.user.sub;
      if (requestingUser !== id) {
        throw new BadRequestException('Você só pode atualizar seu próprio perfil');
      }

      const exists = await this.firebaseService.documentExists('Skatistas', id);
      if (!exists) {
        throw new NotFoundException('Skatista não encontrado');
      }

      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await this.firebaseService.updateDocument('Skatistas', id, dataToUpdate);
      
      return {
        message: 'Skatista atualizado com sucesso',
        id
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar skatista');
    }
  }

  @Get(':id/spots')
  async getSpots(@Param('id') id: string) {
    try {
      const doc = await this.firebaseService.getDocument('Skatistas', id);
      if (!doc.exists) {
        throw new NotFoundException('Skatista não encontrado');
      }
      
      const skatista = doc.data();
      return {
        spots: skatista.spots || [],
        total: skatista.spots?.length || 0
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar spots do skatista');
    }
  }

  @Post(':id/spots')
  @UseGuards(JwtAuthGuard)
  async addSpot(@Param('id') id: string, @Body() spotData: any, @Request() req) {
    try {
      const requestingUser = req.user.sub;
      if (requestingUser !== id) {
        throw new BadRequestException('Você só pode adicionar spots ao seu próprio perfil');
      }

      const doc = await this.firebaseService.getDocument('Skatistas', id);
      if (!doc.exists) {
        throw new NotFoundException('Skatista não encontrado');
      }
      
      const skatista = doc.data();
      const currentSpots = skatista.spots || [];
      
      // Verificar se o spot já existe
      const spotExists = currentSpots.some((spot: any) => {
        const existingPath = spot.path || spot;
        const newPath = spotData.path || spotData;
        return existingPath === newPath;
      });

      if (spotExists) {
        throw new BadRequestException('Spot já adicionado');
      }
      
      // Adicionar novo spot
      const newSpots = [...currentSpots, spotData];
      
      await this.firebaseService.updateDocument('Skatistas', id, {
        spots: newSpots,
        updatedAt: new Date().toISOString()
      });
      
      return {
        message: 'Spot adicionado com sucesso',
        spots: newSpots
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao adicionar spot');
    }
  }

  @Delete(':id/spots/:spotIndex')  // ✅ Agora funciona
  @UseGuards(JwtAuthGuard)
  async removeSpot(@Param('id') id: string, @Param('spotIndex') spotIndex: string, @Request() req) {
    try {
      const requestingUser = req.user.sub;
      if (requestingUser !== id) {
        throw new BadRequestException('Você só pode remover spots do seu próprio perfil');
      }

      const doc = await this.firebaseService.getDocument('Skatistas', id);
      if (!doc.exists) {
        throw new NotFoundException('Skatista não encontrado');
      }
      
      const skatista = doc.data();
      const currentSpots = skatista.spots || [];
      const index = parseInt(spotIndex);
      
      if (index < 0 || index >= currentSpots.length) {
        throw new BadRequestException('Spot não encontrado');
      }
      
      // Remover spot pelo índice
      const newSpots = currentSpots.filter((_: any, i: number) => i !== index);
      
      await this.firebaseService.updateDocument('Skatistas', id, {
        spots: newSpots,
        updatedAt: new Date().toISOString()
      });
      
      return {
        message: 'Spot removido com sucesso',
        spots: newSpots
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover spot');
    }
  }
}