import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semestre } from './entities/semestre.entity';
import { CreateSemestreDto } from './dto/create-semestre.dto';

@Injectable()
export class SemestreService {
  constructor(
    @InjectRepository(Semestre)
    private readonly semestreRepo: Repository<Semestre>,
  ) {}

  create(dto: CreateSemestreDto) {
    const semestre = this.semestreRepo.create(dto);
    return this.semestreRepo.save(semestre);
  }

  findAll() {
    return this.semestreRepo.find();
  }

  findOne(id: number) {
    return this.semestreRepo.findOne({ where: { semestre_id: id } });
  }

  async update(id: number, dto: Partial<CreateSemestreDto>) {
    const semestre = await this.findOne(id);
    if (!semestre) throw new NotFoundException('Semestre no encontrado');
    Object.assign(semestre, dto);
    return this.semestreRepo.save(semestre);
  }

  async remove(id: number) {
    const semestre = await this.findOne(id);
    if (!semestre) throw new NotFoundException('Semestre no encontrado');
    return this.semestreRepo.remove(semestre);
  }
}
