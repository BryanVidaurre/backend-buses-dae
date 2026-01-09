/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { IngresoBusService } from './ingreso-bus.service';
import { CreateIngresoBusDto } from './dto/create-ingreso-bus.dto';

@Controller('ingresos')
export class IngresoBusController {
  constructor(private readonly ingresoBusService: IngresoBusService) {}

  // Endpoint para que Postman o la App obtengan la lista de alumnos activos
  @Get('autorizados')
  async getAutorizados() {
    return this.ingresoBusService.getEstudiantesAutorizados();
  }

  // Endpoint para registrar el ingreso usando tu DTO
  @Post('registrar')
  async registrar(@Body() createIngresoDto: CreateIngresoBusDto) {
    return this.ingresoBusService.registrarIngreso(createIngresoDto);
  }
}
