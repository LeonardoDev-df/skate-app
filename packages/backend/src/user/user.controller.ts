import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  ForbiddenException,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @RateLimit({ action: 'list_users', limit: 20 })
  async findAll(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ) {
    // Verificar se usuário tem permissão para listar todos os usuários
    const user = req.user;
    const isAdmin = await this.userService.isAdmin(user.sub);
    
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem listar todos os usuários');
    }

    const limitNum = limit ? parseInt(limit) : 10;
    const pageNum = page ? parseInt(page) : 1;
    
    return this.userService.findAll(limitNum, pageNum);
  }

  @Get('me')
  @RateLimit({ action: 'get_profile', limit: 30 })
  async getMyProfile(@Request() req) {
    return this.userService.findOne(req.user.sub);
  }

  @Get(':uid')
  @RateLimit({ action: 'get_user', limit: 30 })
  async findOne(@Param('uid') uid: string, @Request() req) {
    const requestingUser = req.user.sub;
    const isAdmin = await this.userService.isAdmin(requestingUser);
    
    // Usuário só pode ver próprio perfil ou ser admin
    if (requestingUser !== uid && !isAdmin) {
      throw new ForbiddenException('Você só pode acessar seu próprio perfil');
    }
    
    return this.userService.findOne(uid);
  }

  @Post()
  @RateLimit({ action: 'create_user', limit: 5 })
  async create(@Body() createUserDto: any, @Request() req) {
    const { uid, ...userData } = createUserDto;
    const requestingUser = req.user.sub;
    const isAdmin = await this.userService.isAdmin(requestingUser);
    
    // Verificar se está tentando criar para si mesmo ou se é admin
    if (uid !== requestingUser && !isAdmin) {
      throw new ForbiddenException('Você só pode criar seu próprio perfil');
    }
    
    return this.userService.create(uid, userData);
  }

  @Put(':uid')
  @RateLimit({ action: 'update_user', limit: 10 })
  async update(
    @Param('uid') uid: string, 
    @Body() updateUserDto: any, 
    @Request() req
  ) {
    const requestingUser = req.user.sub;
    const isAdmin = await this.userService.isAdmin(requestingUser);
    
    // Usuário só pode atualizar próprio perfil ou ser admin
    if (requestingUser !== uid && !isAdmin) {
      throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
    }
    
    return this.userService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  @RateLimit({ action: 'delete_user', limit: 3 })
  async delete(@Param('uid') uid: string, @Request() req) {
    const requestingUser = req.user.sub;
    const isAdmin = await this.userService.isAdmin(requestingUser);
    
    // Usuário só pode deletar próprio perfil ou ser admin
    if (requestingUser !== uid && !isAdmin) {
      throw new ForbiddenException('Você só pode deletar seu próprio perfil');
    }
    
    return this.userService.delete(uid);
  }

  @Get(':uid/skateparks')
  @RateLimit({ action: 'get_user_skateparks', limit: 20 })
  async getUserSkateparks(@Param('uid') uid: string, @Request() req) {
    const requestingUser = req.user.sub;
    const isAdmin = await this.userService.isAdmin(requestingUser);
    
    if (requestingUser !== uid && !isAdmin) {
      throw new ForbiddenException('Acesso negado');
    }
    
    return this.userService.getUserSkateparks(uid);
  }

  @Post(':uid/skateparks/:parkId')
  @RateLimit({ action: 'add_skatepark', limit: 10 })
  async addSkatepark(
    @Param('uid') uid: string,
    @Param('parkId') parkId: string,
    @Request() req
  ) {
    const requestingUser = req.user.sub;
    
    if (requestingUser !== uid) {
      throw new ForbiddenException('Você só pode adicionar skateparks ao seu próprio perfil');
    }
    
    return this.userService.addSkatepark(uid, parkId);
  }
}