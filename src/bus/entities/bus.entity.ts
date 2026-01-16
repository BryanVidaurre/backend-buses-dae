import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IngresoBus } from '../../ingreso-bus/entities/ingreso-bus.entity';

@Entity({ name: 'bus' })
export class Bus {
  @PrimaryGeneratedColumn({ name: 'bus_id' })
  bus_id: number;

  @Column({ name: 'recorrido_numero', unique: true })
  recorrido_numero: number;

  @Column({ name: 'bus_patente' })
  bus_patente: string;

  @Column({ name: 'horario_inicio' })
  horario_inicio: string;

  @Column({ name: 'horario_fin' })
  horario_fin: string;

  @Column({ name: 'deleted', default: false })
  deleted: boolean;

  @OneToMany(() => IngresoBus, (ib) => ib.bus)
  ingresosBus: IngresoBus[];
}
