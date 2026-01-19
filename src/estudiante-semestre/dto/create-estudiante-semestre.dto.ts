import {
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstudianteSemestreDto {
  @ApiProperty({
    example: 1024,
    description: 'ID de la persona (Relación con la tabla Estudiante)',
  })
  @IsInt()
  @IsNotEmpty()
  per_id: number;

  @ApiProperty({
    example: 5,
    description: 'ID del semestre académico (Relación con la tabla Semestre)',
  })
  @IsInt()
  @IsNotEmpty()
  semestre_id: number;

  @ApiProperty({
    example: 120,
    description: 'Código identificador de la carrera (Relación con Carrera)',
  })
  @IsInt()
  @IsNotEmpty()
  car_cod_carrera: number;

  @ApiProperty({
    example: 2023,
    description: 'Año específico de ingreso a esta carrera',
  })
  @IsInt()
  @IsNotEmpty()
  anio_ingreso: number;

  @ApiProperty({
    example: 'Av. 18 de Septiembre #2222, Arica',
    description: 'Dirección de residencia del grupo familiar',
    required: false,
  })
  @IsString()
  @IsOptional()
  direccion_familiar?: string;

  @ApiProperty({
    example: true,
    description: 'Estado de la matrícula (true: Activo / false: Inactivo)',
    default: true,
  })
  @IsBoolean()
  estado: boolean;
}
