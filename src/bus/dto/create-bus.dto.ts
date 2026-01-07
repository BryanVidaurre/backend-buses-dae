import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  bus_patente: string;
}
