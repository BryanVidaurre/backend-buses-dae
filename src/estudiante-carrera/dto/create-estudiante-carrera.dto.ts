import { IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateEstudianteCarreraDto {
  @IsInt()
  @IsNotEmpty()
  per_id: number;

  @IsInt()
  @IsNotEmpty()
  car_cod_carrera: number;

  @IsInt()
  @IsNotEmpty()
  anio_ingreso: number;

  @IsBoolean()
  estado: boolean;
}
