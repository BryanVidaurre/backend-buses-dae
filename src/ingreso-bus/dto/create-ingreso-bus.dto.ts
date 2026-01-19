import { IsInt, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngresoBusDto {
  @ApiProperty({
    example: 450,
    description: 'ID de la asociación Estudiante-Semestre (obtenido del QR)',
  })
  @IsInt()
  @IsNotEmpty()
  est_sem_id: number;

  @ApiProperty({
    example: 12,
    description: 'ID del bus donde se realiza el escaneo',
  })
  @IsInt()
  @IsNotEmpty()
  bus_id: number;

  @ApiProperty({
    example: 99823,
    description: 'ID único del código QR escaneado',
  })
  @IsInt()
  @IsNotEmpty()
  qr_id: number;

  @ApiProperty({
    example: '2024-03-25T08:30:00Z',
    description: 'Fecha y hora del escaneo (Formato ISO8601)',
  })
  @IsDateString()
  fecha_hora: Date;

  @ApiProperty({
    example: -18.4783,
    description: 'Coordenada de latitud capturada por el GPS del móvil',
  })
  @IsNumber()
  latitud: number;

  @ApiProperty({
    example: -70.2999,
    description: 'Coordenada de longitud capturada por el GPS del móvil',
  })
  @IsNumber()
  longitud: number;
}
