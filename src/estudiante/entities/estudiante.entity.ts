/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { EstudianteCarrera } from 'src/estudiante-carrera/entities/estudiante-carrera.entity';
import { QrToken } from 'src/qr-token/entities/qr-token.entity';
import { IngresoBus } from 'src/ingreso-bus/entities/ingreso-bus.entity';

@Entity()
export class Estudiante {
  @PrimaryColumn()
  per_id: string;

  @Column()
  per_drut: string;

  @Column()
  pna_nom: string;

  @Column()
  pna_apat: string;

  @Column()
  pna_amat: string;

  @Column()
  sex_cod: string;

  @Column()
  mat_anio_ingreso: number;

  @Column({ unique: true })
  per_email: string;

  @Column()
  per_celular: string;

  @Column('text')
  direccion_familiar: string;

  @OneToMany(() => EstudianteCarrera, ec => ec.estudiante)
  carreras: EstudianteCarrera[];

  @OneToMany(() => QrToken, qr => qr.estudiante)
  qrTokens: QrToken[];

  @OneToMany(() => IngresoBus, ib => ib.estudiante)
  ingresos: IngresoBus[];
}
