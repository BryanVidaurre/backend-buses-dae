import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { EstudianteSemestre } from '../../estudiante-semestre/entities/estudiante-semestre.entity';
import { QrToken } from '../../qr-token/entities/qr-token.entity';
import { EstudianteCarrera } from 'src/estudiante-carrera/entities/estudiante-carrera.entity';

@Entity({ name: 'estudiante' })
export class Estudiante {
  @PrimaryColumn({ name: 'per_id' })
  per_id: string;

  @Column({ name: 'per_drut' })
  per_drut: string;

  @Column({ name: 'pna_nom' })
  pna_nom: string;

  @Column({ name: 'pna_apat' })
  pna_apat: string;

  @Column({ name: 'pna_amat' })
  pna_amat: string;

  @Column({ name: 'sex_cod' })
  sex_cod: string;

  @Column({ name: 'mat_anio_ingreso' })
  mat_anio_ingreso: number;

  @Column({ name: 'per_email', unique: true })
  per_email: string;

  @Column({ name: 'per_celular' })
  per_celular: string;

  @OneToMany(() => EstudianteCarrera, (ec) => ec.estudiante)
  carreras: EstudianteCarrera[];

  @OneToMany(() => EstudianteSemestre, (es) => es.estudiante)
  estudiantesSemestre: EstudianteSemestre[];

  @OneToMany(() => QrToken, (qr) => qr.estudiante)
  qrTokens: QrToken[];
}
