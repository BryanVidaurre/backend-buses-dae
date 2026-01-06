import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { EstudianteCarrera } from 'src/estudiante-carrera/entities/estudiante-carrera.entity';

@Entity()
export class Carrera {
  @PrimaryColumn()
  car_cod_carrera: number;

  @Column()
  prg_nombre_corto: string;

  @Column()
  depto: string;

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => EstudianteCarrera, ec => ec.carrera)
  estudiantes: EstudianteCarrera[];
}
