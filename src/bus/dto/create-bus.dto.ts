import { IsString, IsNotEmpty, IsNumber, Min, Matches } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  bus_patente: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  recorrido_numero: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horario_inicio debe tener formato HH:mm',
  })
  horario_inicio: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horario_fin debe tener formato HH:mm',
  })
  horario_fin: string;
}
