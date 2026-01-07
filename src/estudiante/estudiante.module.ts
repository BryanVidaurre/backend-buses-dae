// estudiante.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './entities/estudiante.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { EstudianteSemestre } from '../estudiante-semestre/entities/estudiante-semestre.entity';
import { EstudianteCarrera } from '../estudiante-carrera/entities/estudiante-carrera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estudiante,
      Carrera,
      Semestre,
      EstudianteSemestre,
      EstudianteCarrera,
    ]),
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService], // por si quieres usarlo desde otro módulo
})
export class EstudianteModule {}
