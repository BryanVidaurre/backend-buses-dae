import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateIngresoBusDto } from './create-ingreso-bus.dto';

export class CreateIngresoBusBatchDto {
  @ApiProperty({
    type: [CreateIngresoBusDto],
    description: 'Arreglo de registros de ingreso capturados por la App móvil',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIngresoBusDto)
  ingresos: CreateIngresoBusDto[];
}
