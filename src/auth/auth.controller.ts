import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@ApiTags('Autenticación') // Agrupa estos endpoints bajo la sección "Autenticación" en Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Cambia el default 201 por 200 que es más común para Login
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida las credenciales del usuario y devuelve un token JWT.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Login exitoso. Devuelve el token de acceso y datos del usuario.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas (Email o Password incorrectos).',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar un nuevo administrador',
    description:
      'Crea una cuenta de administrador utilizando correos de gestión institucional. Este endpoint deberia desactivarse al crear un administrador o ser progetegido adecuadamente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Administrador creado con éxito.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el correo ya se encuentra registrado.',
  })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }
}
