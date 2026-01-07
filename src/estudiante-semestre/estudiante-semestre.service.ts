import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteSemestre } from './entities/estudiante-semestre.entity';
import { CreateEstudianteSemestreDto } from './dto/create-estudiante-semestre.dto';
@Injectable()
export class EstudianteSemestreService {
  constructor(
    @InjectRepository(EstudianteSemestre)
    private readonly estSemRepo: Repository<EstudianteSemestre>,
  ) {}

  create(dto: CreateEstudianteSemestreDto) {
    const estSem = this.estSemRepo.create(dto);
    return this.estSemRepo.save(estSem);
  }

  findAll() {
    return this.estSemRepo.find({
      relations: ['estudiante', 'semestre', 'carrera'],
    });
  }

  findOne(id: number) {
    return this.estSemRepo.findOne({
      where: { est_sem_id: id },
      relations: ['estudiante', 'semestre', 'carrera'],
    });
  }

  async update(id: number, dto: Partial<CreateEstudianteSemestreDto>) {
    const estSem = await this.findOne(id);
    if (!estSem)
      throw new NotFoundException('EstudianteSemestre no encontrado');
    Object.assign(estSem, dto);
    return this.estSemRepo.save(estSem);
  }

  async remove(id: number) {
    const estSem = await this.findOne(id);
    if (!estSem)
      throw new NotFoundException('EstudianteSemestre no encontrado');
    return this.estSemRepo.remove(estSem);
  }
}
