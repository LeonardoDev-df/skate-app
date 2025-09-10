import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async findAll(limit: number = 10, page: number = 1) {
    try {
      const offset = (page - 1) * limit;
      const users = await this.firebaseService.getAllDocuments('users');
      
      const paginatedUsers = users.slice(offset, offset + limit);
      
      return {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit)
        }
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar usuários');
    }
  }

  async findOne(uid: string) {
    try {
      const userDoc = await this.firebaseService.getDocument('users', uid);
      
      if (!userDoc.exists) {
        throw new NotFoundException('Usuário não encontrado');
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar usuário');
    }
  }

  async create(uid: string, userData: any) {
    try {
      // Verificar se usuário já existe
      const exists = await this.firebaseService.documentExists('users', uid);
      if (exists) {
        throw new BadRequestException('Usuário já existe');
      }

      const userToCreate = {
        ...userData,
        uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: userData.role || 'user', // default role
        status: 'active'
      };

      await this.firebaseService.createDocument('users', userToCreate, uid);
      
      return {
        message: 'Usuário criado com sucesso',
        user: userToCreate
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async update(uid: string, updateData: any) {
    try {
      const exists = await this.firebaseService.documentExists('users', uid);
      if (!exists) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Remover campos que não devem ser atualizados diretamente
      delete dataToUpdate.uid;
      delete dataToUpdate.createdAt;

      await this.firebaseService.updateDocument('users', uid, dataToUpdate);
      
      return {
        message: 'Usuário atualizado com sucesso',
        uid
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }

  async delete(uid: string) {
    try {
      const exists = await this.firebaseService.documentExists('users', uid);
      if (!exists) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.firebaseService.deleteDocument('users', uid);
      
      return {
        message: 'Usuário deletado com sucesso',
        uid
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }

  async isAdmin(uid: string): Promise<boolean> {
    try {
      const userDoc = await this.firebaseService.getDocument('users', uid);
      if (!userDoc.exists) {
        return false;
      }
      
      const userData = userDoc.data();
      return userData?.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  async getUserSkateparks(uid: string) {
    try {
      // Buscar skatista na coleção Skatistas
      const skatistaDoc = await this.firebaseService.getDocument('Skatistas', uid);
      
      if (!skatistaDoc.exists) {
        return { skateparks: [] };
      }
      
      const skatistaData = skatistaDoc.data();
      const spots = skatistaData?.spots || [];
      
      return {
        skateparks: spots,
        count: spots.length
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar skateparks do usuário');
    }
  }

  async addSkatepark(uid: string, parkId: string) {
    try {
      const skatistaDoc = await this.firebaseService.getDocument('Skatistas', uid);
      
      if (!skatistaDoc.exists) {
        throw new NotFoundException('Skatista não encontrado');
      }
      
      // ✅ CORRIGIDO: Usar skatistaDoc.data() em vez de skatistaData.data()
      const skatistaData = skatistaDoc.data();
      const currentSpots = skatistaData?.spots || [];
      
      // Verificar se já não tem o skatepark
      const alreadyHas = currentSpots.some((spot: any) => spot.id === parkId);
      if (alreadyHas) {
        throw new BadRequestException('Skatepark já adicionado');
      }
      
      // Adicionar novo skatepark
      const newSpots = [...currentSpots, { id: parkId, addedAt: new Date().toISOString() }];
      
      await this.firebaseService.updateDocument('Skatistas', uid, {
        spots: newSpots,
        updatedAt: new Date().toISOString()
      });
      
      return {
        message: 'Skatepark adicionado com sucesso',
        parkId
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao adicionar skatepark');
    }
  }
}