import { IsInt, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateIngresoBusDto {
  @IsInt()
  @IsNotEmpty()
  est_sem_id: number;

  @IsInt()
  @IsNotEmpty()
  bus_id: number;

  @IsInt()
  @IsNotEmpty()
  qr_id: number;

  @IsDateString()
  fecha_hora: Date;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;
}
