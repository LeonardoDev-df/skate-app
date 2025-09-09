import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('skatistas')
export class SkatistasController {
  constructor(private firebaseService: FirebaseService) {}

  @Get()
  async findAll() {
    const collection = await this.firebaseService.getCollection('Skatistas');
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.firebaseService.getDocument('Skatistas', id);
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  @Post()
  async create(@Body() createData: any) {
    return this.firebaseService.createDocument('Skatistas', createData);
  }
}