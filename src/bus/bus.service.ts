import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepo: Repository<Bus>,
  ) {}

  async create(dto: CreateBusDto) {
    const bus = this.busRepo.create(dto);
    return await this.busRepo.save(bus);
  }

  findAll() {
    return this.busRepo.find();
  }
}
