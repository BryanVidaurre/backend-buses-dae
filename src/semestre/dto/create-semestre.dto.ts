import { IsInt, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSemestreDto {
  @ApiProperty({
    example: 2024,
    description: 'Año académico del semestre',
  })
  @IsInt()
  @IsNotEmpty()
  anio: number;

  @ApiProperty({
    example: '1',
    description: 'Periodo del año (ej. "1", "2" o "Verano")',
  })
  @IsString()
  @IsNotEmpty()
  periodo: string;

  @ApiProperty({
    example: true,
    description:
      'Define si el semestre es el actual para validaciones de ingreso',
    default: true,
  })
  @IsBoolean()
  activo: boolean;
}
