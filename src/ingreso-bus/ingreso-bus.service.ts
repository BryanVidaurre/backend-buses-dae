/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngresoBus } from './entities/ingreso-bus.entity';
import { Bus } from 'src/bus/entities/bus.entity';

@Injectable()
export class IngresoBusService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(IngresoBus)
    private readonly ingresoBusRepository: Repository<IngresoBus>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  async getEstudiantesAutorizados() {
    console.log('Consultando estudiantes autorizados para ingreso al bus');
    const autorizados = await this.dataSource.query(`
      SELECT e.per_id, e.pna_nom, e.pna_apat, e.pna_amat, qt.token, es.est_sem_id, qt.qr_id
      FROM estudiante e
      JOIN estudiante_semestre es ON e.per_id = es.per_id
      JOIN semestre s ON s.semestre_id = es.semestre_id
      JOIN qr_token qt ON e.per_id = qt.per_id
      WHERE s.activo = 1 AND es.estado = 1
    `);

    return autorizados;
  }

  async registrarIngreso(data: any) {
    const fecha = new Date(parseInt(data.fecha_hora));

    const horaActual = fecha.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    console.log(
      `Buscando recorrido para patente ${data.bus_patente} a las ${horaActual}`,
    );

    const busAsignado = await this.busRepository
      .createQueryBuilder('bus')
      .where('bus.bus_patente = :patente', { patente: data.bus_patente })
      .andWhere(':hora BETWEEN bus.horario_inicio AND bus.horario_fin', {
        hora: horaActual,
      })
      .getOne();

    if (!busAsignado) {
      throw new NotFoundException(
        `No hay un recorrido activo para la patente ${data.bus_patente} en el horario ${horaActual}`,
      );
    }

    const nuevoIngreso = this.ingresoBusRepository.create({
      fecha_hora: fecha,
      latitud: data.latitud,
      longitud: data.longitud,
      est_sem_id: data.est_sem_id,
      bus_id: busAsignado.bus_id,
      qr_id: data.qr_id,
    });

    return await this.ingresoBusRepository.save(nuevoIngreso);
  }

  async createMany(datos: any[]) {
    console.log(
      `Procesando lote de ${datos.length} registros con validación de patente/horario`,
    );

    const resultados = await Promise.all(
      datos.map(async (item) => {
        const fecha = new Date(parseInt(item.fecha_hora));
        const horaActual = fecha.toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        console.log(
          `Buscando recorrido para patente ${item.bus_patente} a las ${horaActual}`,
        );
        const busAsignado = await this.busRepository
          .createQueryBuilder('bus')
          .where('bus.bus_patente = :patente', { patente: item.bus_patente })
          .andWhere(':hora BETWEEN bus.horario_inicio AND bus.horario_fin', {
            hora: horaActual,
          })
          .getOne();

        if (!busAsignado) {
          console.warn(
            `Saltando registro: No hay recorrido para ${item.bus_patente} a las ${horaActual}`,
          );
          return null; // Retornamos null para los que fallan
        }

        const ingreso = new IngresoBus();
        ingreso.est_sem_id = item.est_sem_id;
        ingreso.qr_id = item.qr_id;
        ingreso.latitud = item.latitud;
        ingreso.longitud = item.longitud;
        ingreso.fecha_hora = fecha;
        ingreso.bus_id = busAsignado.bus_id;

        return ingreso;
      }),
    );

    // Filtramos los nulos para quedarnos solo con los ingresos válidos
    const nuevosIngresos = resultados.filter((ingreso) => ingreso !== null);

    if (nuevosIngresos.length === 0) {
      return {
        message:
          'No se procesó ningún registro: ninguno coincidía con un horario de bus activo.',
        procesados: 0,
      };
    }

    const guardados = await this.ingresoBusRepository.save(nuevosIngresos);

    return {
      message: `Lote procesado exitosamente.`,
      guardados: guardados.length,
      saltados: datos.length - guardados.length,
    };
  }

  async getDashboardData() {
    const [buses, volumen, alumnos, ranking, puntosMapa, totalEstudiantes] =
      await Promise.all([
        // 1. Uso de cada bus por semestre
        this.dataSource.query(`
        SELECT 
            s.anio || '-' || s.periodo as semestre, 
            b.recorrido_numero as patente, 
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
            b.recorrido_numero as bus_patente
          FROM ingreso_bus ib 
          JOIN bus b ON ib.bus_id = b.bus_id 
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
