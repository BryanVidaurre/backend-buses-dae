import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty()
  prg_nombre_corto: string;

  @IsString()
  @IsNotEmpty()
  depto: string;
}
