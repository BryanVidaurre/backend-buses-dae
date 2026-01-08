import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Carrera } from '../../carrera/entities/carrera.entity';

@Entity()
export class EstudianteCarrera {
  @PrimaryGeneratedColumn()
  est_car_id: number;

  @ManyToOne(() => Estudiante, (e) => e.carreras)
  estudiante: Estudiante;

  @ManyToOne(() => Carrera, (c) => c.estudiantes)
  carrera: Carrera;
  @Column()
  estado: boolean;
}
