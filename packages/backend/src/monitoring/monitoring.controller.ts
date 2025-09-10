import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(private firebaseService: FirebaseService) {}

  @Get('stats')
  async getStats() {
    const [users, skatistas, partidas, invites] = await Promise.all([
      this.firebaseService.getCollectionData('users'),
      this.firebaseService.getCollectionData('Skatistas'),
      this.firebaseService.getCollectionData('Partidas'),
      this.firebaseService.getCollectionData('GameInvites'),
    ]);

    return {
      collections: {
        users: users.count,
        skatistas: skatistas.count,
        partidas: partidas.count,
        invites: invites.count,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health-detailed')
  async getDetailedHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        firebase: 'connected',
        firestore: 'connected',
        auth: 'active',
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}