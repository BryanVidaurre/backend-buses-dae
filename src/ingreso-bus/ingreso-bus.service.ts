/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/ingresos/ingresos.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class IngresoBusService {
  constructor(private dataSource: DataSource) {}

  // 1. Obtener la "Lista Blanca" para Postman
  async getEstudiantesAutorizados() {
    console.log('Obteniendo estudiantes autorizados...');
    return await this.dataSource.query(`
      SELECT e.per_id, e.pna_nom, e.pna_apat, e.pna_amat, qt.token, es.est_sem_id, qt.qr_id
      FROM estudiante e
      JOIN estudiante_semestre es ON e.per_id = es.per_id
      JOIN semestre s ON s.semestre_id = es.semestre_id
      JOIN qr_token qt ON e.per_id = qt.per_id
      WHERE s.activo = true AND es.estado = true
    `);
  }

  // 2. Registrar el ingreso
  async registrarIngreso(data: any) {
    console.log('Registrando ingreso de bus con datos:', data);

    // Convertimos el timestamp (string/number) a un objeto Date de JS
    // Esto evita errores de formato en PostgreSQL
    const fechaAsistencia = new Date(parseInt(data.fecha_hora));

    return await this.dataSource.query(
      `
    INSERT INTO ingreso_bus (fecha_hora, latitud, longitud, est_sem_id, bus_id, qr_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
      [
        fechaAsistencia,
        data.latitud,
        data.longitud,
        data.est_sem_id,
        data.bus_id,
        data.qr_id,
      ],
    );
  }
}
