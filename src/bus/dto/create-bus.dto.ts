import { IsString, IsNotEmpty, IsNumber, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusDto {
  @ApiProperty({
    example: 'ABCD-12',
    description: 'Patente única del vehículo',
  })
  @IsString()
  @IsNotEmpty()
  bus_patente: string;

  @ApiProperty({
    example: 1,
    description: 'Número identificador del recorrido asignado',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  recorrido_numero: number;

  @ApiProperty({
    example: '08:00',
    description: 'Hora de inicio del bloque (formato 24h HH:mm)',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horario_inicio debe tener formato HH:mm',
  })
  horario_inicio: string;

  @ApiProperty({
    example: '14:00',
    description: 'Hora de término del bloque (formato 24h HH:mm)',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horario_fin debe tener formato HH:mm',
  })
  horario_fin: string;
}
