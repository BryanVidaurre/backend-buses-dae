import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstudianteSemestre } from '../../estudiante-semestre/entities/estudiante-semestre.entity';
import { Bus } from '../../bus/entities/bus.entity';
import { QrToken } from '../../qr-token/entities/qr-token.entity';

@Entity({ name: 'ingreso_bus' })
export class IngresoBus {
  @PrimaryGeneratedColumn({ name: 'ingreso_id' })
  ingreso_id: number;

  @ManyToOne(() => EstudianteSemestre, (es) => es.ingresosBus)
  @JoinColumn({ name: 'est_sem_id' })
  estudianteSemestre: EstudianteSemestre;

  @ManyToOne(() => Bus, (b) => b.ingresosBus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @ManyToOne(() => QrToken, (qr) => qr.ingresosBus)
  @JoinColumn({ name: 'qr_id' })
  qr: QrToken;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fecha_hora: Date;

  @Column({ name: 'latitud', type: 'double precision' })
  latitud: number;

  @Column({ name: 'longitud', type: 'double precision' })
  longitud: number;
}
