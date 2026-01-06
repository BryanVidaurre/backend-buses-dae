/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsString } from 'class-validator';

export class CreateEstudianteCarreraDto {
  @IsString()
  per_id: string;

  @IsInt()
  car_cod_carrera: number;

  @IsInt()
  anio_ingreso: number;

  @IsString()
  estado: string;
}
