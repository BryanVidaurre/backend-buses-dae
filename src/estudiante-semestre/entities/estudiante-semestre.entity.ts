import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Semestre } from '../../semestre/entities/semestre.entity';
import { Carrera } from '../../carrera/entities/carrera.entity';
import { IngresoBus } from '../../ingreso-bus/entities/ingreso-bus.entity';
import { QrToken } from '../../qr-token/entities/qr-token.entity';

@Entity({ name: 'estudiante_semestre' })
export class EstudianteSemestre {
  @PrimaryGeneratedColumn({ name: 'est_sem_id' })
  est_sem_id: number;

  @Column({ name: 'anio_ingreso' })
  anio_ingreso: number;

  @Column({ name: 'direccion_familiar', type: 'text' })
  direccion_familiar: string;

  @Column({ name: 'estado', type: 'boolean' })
  estado: boolean;

  @ManyToOne(() => Estudiante, (e) => e.estudiantesSemestre)
  @JoinColumn({ name: 'per_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Semestre, (s) => s.estudiantesSemestre)
  @JoinColumn({ name: 'semestre_id' })
  semestre: Semestre;

  @ManyToOne(() => Carrera, (c) => c.estudiantesSemestre)
  @JoinColumn({ name: 'car_cod_carrera' })
  carrera: Carrera;

  @OneToMany(() => QrToken, (qr) => qr.estudianteSemestre)
  qrTokens: QrToken[];

  @OneToMany(() => IngresoBus, (ib) => ib.estudianteSemestre)
  ingresosBus: IngresoBus[];
}
