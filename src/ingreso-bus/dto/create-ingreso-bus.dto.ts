/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString } from 'class-validator';

export class CreateIngresoBusDto {
  @IsString()
  token: string; // QR escaneado

  @IsNumber()
  bus_id: number;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;
}
