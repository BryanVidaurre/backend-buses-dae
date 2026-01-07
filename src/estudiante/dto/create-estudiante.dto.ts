import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  per_id: string;

  @IsString()
  @IsNotEmpty()
  per_drut: string;

  @IsString()
  @IsNotEmpty()
  pna_nom: string;

  @IsString()
  @IsNotEmpty()
  pna_apat: string;

  @IsString()
  @IsNotEmpty()
  pna_amat: string;

  @IsString()
  @IsNotEmpty()
  sex_cod: string;

  @IsNotEmpty()
  mat_anio_ingreso: number;

  @IsEmail()
  per_email: string;

  @IsOptional()
  @IsString()
  per_celular?: string;
}
