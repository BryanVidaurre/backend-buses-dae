import { Controller } from '@nestjs/common';
import { QrTokenService } from './qr-token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seguridad y QR') // Permite que el módulo sea visible en Swagger
@Controller('qr-token')
export class QrTokenController {
  constructor(private readonly qrTokenService: QrTokenService) {}

  // Actualmente este controlador no tiene métodos expuestos.
  // Swagger lo mostrará como una sección vacía hasta que se definan @Get, @Post, etc.
}
