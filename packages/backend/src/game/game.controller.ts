import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//import { GameService } from './game.service';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  //constructor(private gameService: GameService) {}

  @Get('invites')
  async getInvites(@Request() req) {
    //return this.gameService.getUserInvites(req.user.sub);
  }

  @Post('invites')
  async createInvite(@Body() inviteData: any, @Request() req) {
  //  return this.gameService.createInvite(req.user.sub, inviteData);
  }

  @Get('matches')
  async getMatches(@Request() req) {
  //  return this.gameService.getUserMatches(req.user.sub);
  }

  @Get('ranking')
  async getRanking() {
 //   return this.gameService.getRanking();
  }
}