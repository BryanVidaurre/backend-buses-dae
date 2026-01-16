import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IngresoBus } from '../../ingreso-bus/entities/ingreso-bus.entity';

@Entity({ name: 'bus' })
export class Bus {
  @PrimaryGeneratedColumn({ name: 'bus_id' })
  bus_id: number;

  // Ahora el recorrido es ÚNICO. No puede haber dos "Recorrido 1".
  @Column({ name: 'recorrido_numero', unique: true })
  recorrido_numero: number;

  // La patente ya no es única. Podría repetirse si es necesario.
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
