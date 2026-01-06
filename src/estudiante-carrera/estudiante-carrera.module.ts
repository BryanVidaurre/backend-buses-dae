import { Module } from '@nestjs/common';
import { EstudianteCarreraService } from './estudiante-carrera.service';
import { EstudianteCarreraController } from './estudiante-carrera.controller';
import { EstudianteCarrera } from './entities/estudiante-carrera.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [EstudianteCarreraController],
  providers: [EstudianteCarreraService],
  imports: [TypeOrmModule.forFeature([EstudianteCarrera])],
})
export class EstudianteCarreraModule {}
