import { Controller } from '@nestjs/common';
import { IngresoBusService } from './ingreso-bus.service';

@Controller('ingreso-bus')
export class IngresoBusController {
  constructor(private readonly ingresoBusService: IngresoBusService) {}
}
