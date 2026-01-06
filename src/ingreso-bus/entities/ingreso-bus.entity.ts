import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Bus } from '../../bus/entities/bus.entity';
import { QrToken } from '../../qr-token/entities/qr-token.entity';

@Entity()
export class IngresoBus {
  @PrimaryGeneratedColumn()
  ingreso_id: number;

  @ManyToOne(() => Estudiante, (e) => e.ingresos)
  estudiante: Estudiante;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Bus, (b) => b.ingresos)
  bus: Bus;

  @ManyToOne(() => QrToken)
  qr: QrToken;

  @Column()
  fecha_hora: Date;

  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;
}
