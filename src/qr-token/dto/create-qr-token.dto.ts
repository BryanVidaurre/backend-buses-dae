/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsString } from 'class-validator';

export class CreateQrTokenDto {
  @IsString()
  per_id: string;

  @IsBoolean()
  activo: boolean;
}
