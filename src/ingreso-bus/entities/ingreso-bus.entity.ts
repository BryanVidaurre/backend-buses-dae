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

  // Estas son las columnas que recibirán el ID directamente
  @Column()
  est_sem_id: number;

  @Column()
  bus_id: number;

  @Column()
  qr_id: number;

  // Estas son las relaciones para hacer JOINs después
  @ManyToOne(() => EstudianteSemestre, (es) => es.ingresosBus)
  @JoinColumn({ name: 'est_sem_id' })
  estudianteSemestre: EstudianteSemestre;

  @ManyToOne(() => Bus, (b) => b.ingresosBus)
  @JoinColumn({ name: 'bus_id' })
  bus: Bus;

  @ManyToOne(() => QrToken, (qr) => qr.ingresosBus)
  @JoinColumn({ name: 'qr_id' })
  qr: QrToken;

  @Column({ type: 'datetime' }) // Cambiado para SQLite
  fecha_hora: Date;

  @Column({ type: 'float' }) // SQLite usa float o real para coordenadas
  latitud: number;

  @Column({ type: 'float' }) // SQLite usa float o real para coordenadas
  longitud: number;
}
