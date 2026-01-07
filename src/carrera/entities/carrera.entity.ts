import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EstudianteSemestre } from '../../estudiante-semestre/entities/estudiante-semestre.entity';
import { EstudianteCarrera } from 'src/estudiante-carrera/entities/estudiante-carrera.entity';

@Entity({ name: 'carrera' })
export class Carrera {
  @PrimaryGeneratedColumn({ name: 'car_cod_carrera' })
  car_cod_carrera: number;

  @Column({ name: 'prg_nombre_corto' })
  prg_nombre_corto: string;

  @Column({ name: 'depto' })
  depto: string;
  @OneToMany(() => EstudianteCarrera, (ec) => ec.carrera)
  estudiantes: EstudianteCarrera[];
  @OneToMany(() => EstudianteSemestre, (es) => es.carrera)
  estudiantesSemestre: EstudianteSemestre[];
}
