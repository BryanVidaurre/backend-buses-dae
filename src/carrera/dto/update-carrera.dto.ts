import { PartialType } from '@nestjs/swagger'; // Cambiado de @nestjs/mapped-types para soporte Swagger
import { CreateCarreraDto } from './create-carrera.dto';

/**
 * DTO para la actualización parcial de Carreras.
 * Hereda todas las propiedades de CreateCarreraDto, pero marcándolas como opcionales.
 */
export class UpdateCarreraDto extends PartialType(CreateCarreraDto) {}
