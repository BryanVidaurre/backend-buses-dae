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

  // 1. Obtener la "Lista Blanca"
  async getEstudiantesAutorizados() {
    console.log('Obteniendo estudiantes autorizados...');
    // Cambiamos la query para que sea compatible con SQLite (usamos alias simples)
    return await this.dataSource.query(`
      SELECT e.per_id, e.pna_nom, e.pna_apat, e.pna_amat, qt.token, es.est_sem_id, qt.qr_id
      FROM estudiante e
      JOIN estudiante_semestre es ON e.per_id = es.per_id
      JOIN semestre s ON s.semestre_id = es.semestre_id
      JOIN qr_token qt ON e.per_id = qt.per_id
      WHERE s.activo = 1 AND es.estado = 1
    `); // Nota: En SQLite los booleanos suelen ser 1 (true) y 0 (false)
  }

  // 2. Registrar el ingreso individual (Compatible con SQLite)
  async registrarIngreso(data: any) {
    console.log('Registrando ingreso de bus con datos:', data);

    // SQLite no usa $1, $2. Usa ? o nombres.
    // Es mejor usar el repositorio para que sea agnóstico a la base de datos.
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

  // 3. REGISTRO MASIVO (La solución definitiva a tus bloqueos)
  async createMany(datos: CreateIngresoBusDto[]) {
    console.log(`Procesando lote de ${datos.length} registros para SQLite`);

    const nuevosIngresos = datos.map((item) => {
      const ingreso = new IngresoBus();

      // Asignamos los IDs directos
      ingreso.est_sem_id = item.est_sem_id;
      ingreso.bus_id = item.bus_id;
      ingreso.qr_id = item.qr_id;

      // Coordenadas
      ingreso.latitud = item.latitud;
      ingreso.longitud = item.longitud;

      // Procesamos la fecha (importante el parseInt si viene como string)
      ingreso.fecha_hora = new Date(parseInt(item.fecha_hora as any));

      return ingreso;
    });

    return await this.ingresoBusRepository.save(nuevosIngresos);
  }
}
