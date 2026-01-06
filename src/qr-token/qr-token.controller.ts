import { Controller } from '@nestjs/common';
import { QrTokenService } from './qr-token.service';

@Controller('qr-token')
export class QrTokenController {
  constructor(private readonly qrTokenService: QrTokenService) {}
}
