import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteSemestreService } from './estudiante-semestre.service';
import { EstudianteSemestreController } from './estudiante-semestre.controller';
import { EstudianteSemestre } from './entities/estudiante-semestre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteSemestre])],
  controllers: [EstudianteSemestreController],
  providers: [EstudianteSemestreService],
  exports: [EstudianteSemestreService],
})
export class EstudianteSemestreModule {}
