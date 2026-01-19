import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IngresoBusService } from './ingreso-bus.service';
import { CreateIngresoBusDto } from './dto/create-ingreso-bus.dto';

@ApiTags('Ingresos (Operaciones de Bus)')
@Controller('ingresos')
export class IngresoBusController {
  constructor(private readonly ingresoBusService: IngresoBusService) {}

  @Get('autorizados')
  @ApiOperation({
    summary: 'Listar estudiantes autorizados',
    description:
      'Devuelve la lista de estudiantes con matrícula activa y token QR vigente para sincronización inicial con la App.',
  })
  async getAutorizados(): Promise<any> {
    return this.ingresoBusService.getEstudiantesAutorizados();
  }

  @Post('registrar')
  @ApiOperation({ summary: 'Registrar un ingreso individual (Online)' })
  @ApiBody({ type: CreateIngresoBusDto })
  @ApiResponse({
    status: 201,
    description: 'Ingreso registrado y validado con el horario del bus.',
  })
  async registrar(@Body() createIngresoDto: CreateIngresoBusDto) {
    return this.ingresoBusService.registrarIngreso(createIngresoDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Sincronización masiva (Offline-to-Online)',
    description:
      'Recibe un lote de registros capturados offline. Valida cada uno según la patente y el bloque horario.',
  })
  @ApiBody({
    type: [CreateIngresoBusDto],
    description: 'Arreglo de ingresos capturados',
  })
  @ApiResponse({
    status: 201,
    description:
      'Lote procesado. Devuelve estadísticas de registros guardados y saltados.',
  })
  async registrarMuchos(@Body() datos: CreateIngresoBusDto[]) {
    return this.ingresoBusService.createMany(datos);
  }

  @Get('analisis/dashboard')
  @ApiOperation({
    summary: 'Datos para Dashboard Estadístico',
    description:
      'Retorna métricas consolidadas: uso por bus, volumen por semestre, ranking de usuarios y puntos geográficos para el mapa.',
  })
  async dashboardData() {
    return this.ingresoBusService.getDashboardData();
  }
}
