import { IsInt, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateSemestreDto {
  @IsInt()
  @IsNotEmpty()
  anio: number;

  @IsString()
  @IsNotEmpty()
  periodo: string;

  @IsBoolean()
  activo: boolean;
}
