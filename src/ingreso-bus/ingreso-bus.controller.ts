/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { IngresoBusService } from './ingreso-bus.service';
import { CreateIngresoBusDto } from './dto/create-ingreso-bus.dto';
import { DataSource } from 'typeorm';

@Controller('ingresos')
export class IngresoBusController {
  constructor(
    private readonly ingresoBusService: IngresoBusService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('autorizados')
  async getAutorizados() {
    return this.ingresoBusService.getEstudiantesAutorizados();
  }

  @Post('registrar')
  async registrar(@Body() createIngresoDto: CreateIngresoBusDto) {
    return this.ingresoBusService.registrarIngreso(createIngresoDto);
  }

  @Post('bulk')
  async registrarMuchos(@Body() datos: CreateIngresoBusDto[]) {
    return this.ingresoBusService.createMany(datos);
  }

  @Get('analisis/dashboard')
  async dashboardData() {
    return this.ingresoBusService.getDashboardData();
  }
}
