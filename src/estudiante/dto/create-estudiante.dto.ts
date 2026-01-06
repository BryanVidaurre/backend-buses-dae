/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  per_id: string;

  @IsString()
  per_drut: string;

  @IsString()
  pna_nom: string;

  @IsString()
  pna_apat: string;

  @IsString()
  pna_amat: string;

  @IsString()
  sex_cod: string;

  @IsInt()
  mat_anio_ingreso: number;

  @IsEmail()
  per_email: string;

  @IsString()
  per_celular: string;

  @IsString()
  direccion_familiar: string;
}
