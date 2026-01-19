import { IsInt, IsUUID, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQrTokenDto {
  @ApiProperty({
    example: 450,
    description: 'ID de la asociación Estudiante-Semestre (Llave foránea)',
  })
  @IsInt()
  @IsNotEmpty()
  est_sem_id: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Token único universal (UUID v4) que se codificará en el QR',
  })
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: true,
    description:
      'Estado de validez del token (true: Escaneable / false: Revocado)',
    default: true,
  })
  @IsBoolean()
  activo: boolean;
}
