import { PartialType } from '@nestjs/swagger'; // Cambiado desde @nestjs/mapped-types
import { CreateQrTokenDto } from './create-qr-token.dto';

/**
 * DTO para la actualización de tokens QR.
 * Permite revocar tokens (activo: false) o actualizar la asociación
 * sin necesidad de enviar el UUID de nuevo.
 */
export class UpdateQrTokenDto extends PartialType(CreateQrTokenDto) {}
