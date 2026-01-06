import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity()
export class QrToken {
  @PrimaryGeneratedColumn()
  qr_id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  fecha_creacion: Date;

  @Column()
  activo: boolean;

  @ManyToOne(() => Estudiante, (e) => e.qrTokens)
  estudiante: Estudiante;
}
