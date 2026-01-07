import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { EstudianteSemestre } from '../../estudiante-semestre/entities/estudiante-semestre.entity';
import { IngresoBus } from '../../ingreso-bus/entities/ingreso-bus.entity';

@Entity({ name: 'qr_token' })
export class QrToken {
  @PrimaryGeneratedColumn({ name: 'qr_id' })
  qr_id: number;

  @Column({ name: 'token', unique: true })
  token: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

  @ManyToOne(() => Estudiante, (e) => e.qrTokens)
  @JoinColumn({ name: 'per_id' })
  estudiante: Estudiante;

  @ManyToOne(() => EstudianteSemestre, (es) => es.qrTokens)
  @JoinColumn({ name: 'est_sem_id' })
  estudianteSemestre: EstudianteSemestre;

  @OneToMany(() => IngresoBus, (ib) => ib.qr)
  ingresosBus: IngresoBus[];
}
