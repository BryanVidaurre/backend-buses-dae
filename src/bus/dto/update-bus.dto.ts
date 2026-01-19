import { PartialType } from '@nestjs/swagger'; // Cambiado de mapped-types a swagger
import { CreateBusDto } from './create-bus.dto';

/**
 * Este DTO permite la actualización parcial de un bus.
 * Todas las propiedades de CreateBusDto están disponibles pero son opcionales.
 */
export class UpdateBusDto extends PartialType(CreateBusDto) {}
