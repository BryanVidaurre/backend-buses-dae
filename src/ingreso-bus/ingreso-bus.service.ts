/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngresoBusDto } from './dto/create-ingreso-bus.dto';
import { IngresoBus } from './entities/ingreso-bus.entity'; // Asegúrate de importar tu entidad

@Injectable()
export class IngresoBusService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(IngresoBus)
    private readonly ingresoBusRepository: Repository<IngresoBus>, // Inyectamos el repo para usar .save()
  ) {}

  async getEstudiantesAutorizados() {
    console.log('Obteniendo estudiantes autorizados...');

    const autorizados = await this.dataSource.query(`
      SELECT e.per_id, e.pna_nom, e.pna_apat, e.pna_amat, qt.token, es.est_sem_id, qt.qr_id
      FROM estudiante e
      JOIN estudiante_semestre es ON e.per_id = es.per_id
      JOIN semestre s ON s.semestre_id = es.semestre_id
      JOIN qr_token qt ON e.per_id = qt.per_id
      WHERE s.activo = 1 AND es.estado = 1
    `);

    console.log(autorizados);
    return autorizados;
  }

  async registrarIngreso(data: any) {
    console.log('Registrando ingreso de bus con datos:', data);

    const nuevoIngreso = this.ingresoBusRepository.create({
      fecha_hora: new Date(parseInt(data.fecha_hora)),
      latitud: data.latitud,
      longitud: data.longitud,
      est_sem_id: data.est_sem_id,
      bus_id: data.bus_id,
      qr_id: data.qr_id,
    });

    return await this.ingresoBusRepository.save(nuevoIngreso);
  }

  async createMany(datos: CreateIngresoBusDto[]) {
    console.log(`Procesando lote de ${datos.length} registros para SQLite`);

    const nuevosIngresos = datos.map((item) => {
      const ingreso = new IngresoBus();

      ingreso.est_sem_id = item.est_sem_id;
      ingreso.bus_id = item.bus_id;
      ingreso.qr_id = item.qr_id;

      ingreso.latitud = item.latitud;
      ingreso.longitud = item.longitud;

      ingreso.fecha_hora = new Date(parseInt(item.fecha_hora as any));

      return ingreso;
    });

    return await this.ingresoBusRepository.save(nuevosIngresos);
  }

  async getDashboardData() {
    const [buses, volumen, alumnos, ranking, puntosMapa, totalEstudiantes] =
      await Promise.all([
        // 1. Uso de cada bus por semestre
        this.dataSource.query(`
        SELECT 
            s.anio || '-' || s.periodo as semestre, 
            b.bus_patente as patente, 
            COUNT(ib.ingreso_id) as total
        FROM bus b
        CROSS JOIN semestre s -- Generamos la combinación de todos los buses con todos los semestres
        LEFT JOIN estudiante_semestre es ON es.semestre_id = s.semestre_id
        LEFT JOIN ingreso_bus ib ON ib.bus_id = b.bus_id AND ib.est_sem_id = es.est_sem_id
        GROUP BY semestre, patente;
      `),

        this.dataSource.query(`
        SELECT s.anio || '-' || s.periodo as semestre, COUNT(ib.ingreso_id) as total
        FROM ingreso_bus ib 
        JOIN estudiante_semestre es ON ib.est_sem_id = es.est_sem_id
        JOIN semestre s ON es.semestre_id = s.semestre_id
        GROUP BY semestre
      `),

        this.dataSource.query(`
        SELECT s.anio || '-' || s.periodo as semestre, COUNT(DISTINCT es.per_id) as total
        FROM estudiante_semestre es 
        JOIN semestre s ON es.semestre_id = s.semestre_id
        GROUP BY semestre
      `),

        this.dataSource.query(`
        SELECT 
            s.anio || '-' || s.periodo as semestre,
            e.pna_nom || ' ' || e.pna_apat || ' ' || e.pna_amat as nombre, 
            COUNT(ib.ingreso_id) as usos
        FROM estudiante e
        JOIN estudiante_semestre es ON e.per_id = es.per_id
        JOIN semestre s ON es.semestre_id = s.semestre_id
        LEFT JOIN ingreso_bus ib ON es.est_sem_id = ib.est_sem_id
        GROUP BY semestre, nombre
        ORDER BY usos DESC, nombre ASC;
      `),

        this.dataSource.query(`
        SELECT 
            ib.latitud, 
            ib.longitud, 
            s.anio || '-' || s.periodo as semestre,
            e.pna_nom || ' ' || e.pna_apat as estudiante,
            b.bus_patente as bus_patente -- <--- AGREGAR ESTO
          FROM ingreso_bus ib 
          JOIN bus b ON ib.bus_id = b.bus_id -- <--- JOIN CON BUS
          JOIN estudiante_semestre es ON ib.est_sem_id = es.est_sem_id 
          JOIN semestre s ON es.semestre_id = s.semestre_id
          JOIN estudiante e ON es.per_id = e.per_id
          WHERE ib.latitud != 0.0 AND ib.longitud != 0.0
      `),
        this.dataSource.query(`
      select count(*) as total from estudiante 
      `),
      ]);

    return { buses, volumen, alumnos, ranking, puntosMapa, totalEstudiantes };
  }
}
