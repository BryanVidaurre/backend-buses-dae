/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class CreateBusDto {
  @IsString()
  bus_patente: string;
}
