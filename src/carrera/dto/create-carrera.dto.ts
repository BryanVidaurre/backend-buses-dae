/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsString } from 'class-validator';

export class CreateCarreraDto {
  @IsInt()
  car_cod_carrera: number;

  @IsString()
  prg_nombre_corto: string;

  @IsString()
  depto: string;
}
