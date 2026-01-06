import { PartialType } from '@nestjs/mapped-types';
import { CreateIngresoBusDto } from './create-ingreso-bus.dto';

export class UpdateIngresoBusDto extends PartialType(CreateIngresoBusDto) {}
