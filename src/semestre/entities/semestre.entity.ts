import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EstudianteSemestre } from '../../estudiante-semestre/entities/estudiante-semestre.entity';

@Entity({ name: 'semestre' })
export class Semestre {
  @PrimaryGeneratedColumn({ name: 'semestre_id' })
  semestre_id: number;

  @Column({ name: 'anio' })
  anio: number;

  @Column({ name: 'periodo' })
  periodo: string;

  @Column({ name: 'activo' })
  activo: boolean;

  @OneToMany(() => EstudianteSemestre, (es) => es.semestre)
  estudiantesSemestre: EstudianteSemestre[];
}
