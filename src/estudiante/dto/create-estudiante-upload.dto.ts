import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateEstudianteUploadDto {
  @IsNotEmpty()
  @IsNumber()
  anio: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  semestre: number;
}
