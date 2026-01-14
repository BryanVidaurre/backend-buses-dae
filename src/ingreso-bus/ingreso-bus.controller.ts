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
  async getDashboardData() {
    const [buses, volumen, alumnos, ranking] = await Promise.all([
      // 1. Uso de cada bus por semestre
      this.dataSource.query(`
        SELECT s.anio || '-' || s.periodo as semestre, b.bus_patente as patente, COUNT(ib.ingreso_id) as total
        FROM ingreso_bus ib 
        JOIN bus b ON ib.bus_id = b.bus_id
        JOIN estudiante_semestre es ON ib.est_sem_id = es.est_sem_id
        JOIN semestre s ON es.semestre_id = s.semestre_id
        GROUP BY semestre, patente
      `),

      // 2. Volumen total de viajes por semestre
      this.dataSource.query(`
        SELECT s.anio || '-' || s.periodo as semestre, COUNT(ib.ingreso_id) as total
        FROM ingreso_bus ib 
        JOIN estudiante_semestre es ON ib.est_sem_id = es.est_sem_id
        JOIN semestre s ON es.semestre_id = s.semestre_id
        GROUP BY semestre
      `),

      // 3. Alumnos únicos atendidos por semestre
      this.dataSource.query(`
        SELECT s.anio || '-' || s.periodo as semestre, COUNT(DISTINCT es.per_id) as total
        FROM estudiante_semestre es 
        JOIN semestre s ON es.semestre_id = s.semestre_id
        JOIN ingreso_bus ib ON es.est_sem_id = ib.est_sem_id
        GROUP BY semestre
      `),

      // 4. Ranking de estudiantes INCLUYENDO semestre
      // Quitamos el LIMIT 10 para que el frontend pueda calcular el ranking real por semestre
      this.dataSource.query(`
        SELECT 
          s.anio || '-' || s.periodo as semestre,
          e.pna_nom || ' ' || e.pna_apat || ' ' || e.pna_amat  as nombre, 
          COUNT(ib.ingreso_id) as usos
        FROM ingreso_bus ib 
        JOIN estudiante_semestre es ON ib.est_sem_id = es.est_sem_id
        JOIN semestre s ON es.semestre_id = s.semestre_id
        JOIN estudiante e ON es.per_id = e.per_id
        GROUP BY semestre, nombre
        ORDER BY usos DESC
      `),
    ]);

    return { buses, volumen, alumnos, ranking };
  }
}
