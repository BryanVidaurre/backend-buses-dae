import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusDto } from './dto/create-bus.dto';
import { Bus } from './entities/bus.entity';
@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepo: Repository<Bus>,
  ) {}

  async create(dto: CreateBusDto): Promise<Bus> {
    // Buscar si ya existe un bus con esa patente, incluso eliminado
    const existingBus = await this.busRepo.findOne({
      where: { bus_patente: dto.bus_patente },
    });

    if (existingBus) {
      if (existingBus.deleted) {
        // Si estaba eliminado, “recuperarlo”
        existingBus.deleted = false;
        return this.busRepo.save(existingBus);
      } else {
        throw new Error('La patente ya existe'); // No duplicar
      }
    }

    // Si no existe, crear uno nuevo
    const bus = this.busRepo.create(dto);
    return this.busRepo.save(bus);
  }

  async findAll(): Promise<Bus[]> {
    return this.busRepo.find({ where: { deleted: false } }); // ✅ Solo no eliminados
  }

  async remove(bus_id: number): Promise<void> {
    const bus = await this.busRepo.findOne({ where: { bus_id } });
    if (!bus) throw new NotFoundException('Bus no encontrado');

    bus.deleted = true; // ✅ Eliminación lógica
    await this.busRepo.save(bus);
  }
}
