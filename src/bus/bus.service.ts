/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';
import { Bus } from './entities/bus.entity';
import { UpdateBusDto } from './dto/update-bus.dto';
@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepo: Repository<Bus>,
  ) {}

  async create(dto: CreateBusDto): Promise<Bus> {
    const existingBus = await this.busRepo.findOne({
      where: { recorrido_numero: dto.recorrido_numero },
    });

    if (existingBus) {
      throw new ConflictException(
        `El recorrido número ${dto.recorrido_numero} ya está asignado al bus con patente ${existingBus.bus_patente}`,
      );
    }

    try {
      const bus = this.busRepo.create(dto);
      return await this.busRepo.save(bus);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException(
          'Error de restricción: Verifique que los datos no estén duplicados.',
        );
      }
      throw new InternalServerErrorException(
        'Error inesperado al crear el bus',
      );
    }
  }

  async findAll(): Promise<Bus[]> {
    return this.busRepo.find({ where: { deleted: false } });
  }

  async remove(bus_id: number): Promise<void> {
    const bus = await this.busRepo.findOne({ where: { bus_id } });
    if (!bus) throw new NotFoundException('Bus no encontrado');

    bus.deleted = true;
    await this.busRepo.save(bus);
  }

  async update(id: number, dto: UpdateBusDto) {
    const bus = await this.busRepo.preload({
      bus_id: Number(id),
      ...dto,
    });

    if (!bus) {
      throw new NotFoundException(`Bus con ID ${id} no encontrado`);
    }

    return this.busRepo.save(bus);
  }
}
