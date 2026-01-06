import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IngresoBus } from 'src/ingreso-bus/entities/ingreso-bus.entity';

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  bus_id: number;

  @Column({ unique: true })
  bus_patente: string;

  @OneToMany(() => IngresoBus, (ib) => ib.bus)
  ingresos: IngresoBus[];
}
