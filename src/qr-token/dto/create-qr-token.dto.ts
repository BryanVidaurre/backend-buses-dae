import { IsInt, IsUUID, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateQrTokenDto {
  @IsInt()
  @IsNotEmpty()
  est_sem_id: number;

  @IsUUID()
  @IsNotEmpty()
  token: string;

  @IsBoolean()
  activo: boolean;
}
