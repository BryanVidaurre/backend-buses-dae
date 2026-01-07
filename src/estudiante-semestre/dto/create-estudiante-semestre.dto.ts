import {
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateEstudianteSemestreDto {
  @IsInt()
  @IsNotEmpty()
  per_id: number;

  @IsInt()
  @IsNotEmpty()
  semestre_id: number;

  @IsInt()
  @IsNotEmpty()
  car_cod_carrera: number;

  @IsInt()
  @IsNotEmpty()
  anio_ingreso: number;

  @IsString()
  @IsOptional()
  direccion_familiar?: string;

  @IsBoolean()
  estado: boolean;
}
