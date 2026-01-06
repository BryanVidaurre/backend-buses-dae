import { Controller } from '@nestjs/common';
import { CarreraService } from './carrera.service';

@Controller('carrera')
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}
}
