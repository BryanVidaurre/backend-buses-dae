import { Controller } from '@nestjs/common';
import { EstudianteCarreraService } from './estudiante-carrera.service';

@Controller('estudiante-carrera')
export class EstudianteCarreraController {
  constructor(private readonly estudianteCarreraService: EstudianteCarreraService) {}
}
