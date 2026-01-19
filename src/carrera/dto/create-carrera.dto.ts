import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarreraDto {
  @ApiProperty({
    example: 'Ingeniería Civil en Computación e Informática',
    description: 'Nombre corto o sigla del programa académico / carrera',
  })
  @IsString()
  @IsNotEmpty()
  prg_nombre_corto: string;

  @ApiProperty({
    example: 'Departamento de Ingeniería de Sistemas y Computación',
    description: 'Departamento académico al cual pertenece la carrera',
  })
  @IsString()
  @IsNotEmpty()
  depto: string;
}
