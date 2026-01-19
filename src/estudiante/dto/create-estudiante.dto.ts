import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstudianteDto {
  @ApiProperty({
    example: '20554321',
    description: 'Identificador interno único de la persona (PER_ID)',
  })
  @IsString()
  @IsNotEmpty()
  per_id: string;

  @ApiProperty({
    example: '20554321-K',
    description: 'RUT del estudiante con guion y dígito verificador',
  })
  @IsString()
  @IsNotEmpty()
  per_drut: string;

  @ApiProperty({
    example: 'JUAN PABLO',
    description: 'Nombres del estudiante',
  })
  @IsString()
  @IsNotEmpty()
  pna_nom: string;

  @ApiProperty({
    example: 'PEREZ',
    description: 'Apellido paterno',
  })
  @IsString()
  @IsNotEmpty()
  pna_apat: string;

  @ApiProperty({
    example: 'GOMEZ',
    description: 'Apellido materno',
  })
  @IsString()
  @IsNotEmpty()
  pna_amat: string;

  @ApiProperty({
    example: 'M',
    description: 'Código de sexo (M/F)',
  })
  @IsString()
  @IsNotEmpty()
  sex_cod: string;

  @ApiProperty({
    example: 2023,
    description: 'Año de ingreso a la institución',
  })
  @IsNumber()
  @IsNotEmpty()
  mat_anio_ingreso: number;

  @ApiProperty({
    example: 'jperez@alumnos.uta.cl',
    description: 'Correo electrónico institucional',
  })
  @IsEmail()
  per_email: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Número de celular de contacto',
    required: false,
  })
  @IsOptional()
  @IsString()
  per_celular?: string;
}
