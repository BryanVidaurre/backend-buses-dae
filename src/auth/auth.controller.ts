import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //dae@gestion.uta.cl  admin123
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  //crear los admin y luego borrar(? verificar si se deja admins dados o que se puedan registrar utilizando los correos de gestion
  @Post()
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }
}
