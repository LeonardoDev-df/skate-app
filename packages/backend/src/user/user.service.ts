import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseConfig } from '../config/firebase.config';

@Injectable()
export class UserService {
  constructor(private firebaseConfig: FirebaseConfig) {}

  async findAll() {
    const snapshot = await this.firebaseConfig
      .getFirestore()
      .collection('users')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async findOne(uid: string) {
    const doc = await this.firebaseConfig
      .getFirestore()
      .collection('users')
      .doc(uid)
      .get();

    if (!doc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  async create(uid: string, userData: any) {
    await this.firebaseConfig
      .getFirestore()
      .collection('users')
      .doc(uid)
      .set(userData);

    return this.findOne(uid);
  }

  async update(uid: string, updateData: any) {
    await this.firebaseConfig
      .getFirestore()
      .collection('users')
      .doc(uid)
      .update(updateData);

    return this.findOne(uid);
  }

  async delete(uid: string) {
    await this.firebaseConfig
      .getFirestore()
      .collection('users')
      .doc(uid)
      .delete();

    return { message: 'Usuário deletado com sucesso' };
  }
}