import { Controller, Get, Param, Query } from '@nestjs/common';
import { SkateparkService } from './skatepark.service';

@Controller('skateparks')
export class SkateparkController {
  constructor(private skateparkService: SkateparkService) {}

  @Get()
  async findAll(@Query('city') city?: string) {
    if (city) {
      return this.skateparkService.findByCity(city);
    }
    return this.skateparkService.findAll();
  }

  @Get('debug')
  async debug() {
    return this.skateparkService.debugSkateparks();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.skateparkService.findOne(id);
  }

  @Get('city/:city')
  async findByCity(@Param('city') city: string) {
    return this.skateparkService.findByCity(city);
  }
}