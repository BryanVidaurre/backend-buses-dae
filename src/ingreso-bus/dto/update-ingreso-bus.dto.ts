import { PartialType } from '@nestjs/swagger'; // Cambiado para soporte completo de Swagger
import { CreateIngresoBusDto } from './create-ingreso-bus.dto';

/**
 * Permite la actualización parcial de un registro de ingreso.
 * Útil para correcciones administrativas posteriores a la sincronización.
 */
export class UpdateIngresoBusDto extends PartialType(CreateIngresoBusDto) {}
