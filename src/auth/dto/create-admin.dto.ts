/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin@uta.cl',
    description: 'Correo electrónico institucional del administrador',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'admin1234',
    description: 'Contraseña de acceso (mínimo 6 caracteres)',
    minLength: 6,
    writeOnly: true, // Indica que este campo se envía pero no se debería retornar en lecturas
  })
  @IsString()
  @MinLength(6)
  password: string;
}
