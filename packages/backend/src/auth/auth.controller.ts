import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { idToken: string }) {
    return this.authService.login(loginDto.idToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }
}