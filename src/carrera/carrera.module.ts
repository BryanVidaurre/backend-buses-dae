import { Module } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { CarreraController } from './carrera.controller';
import { Carrera } from './entities/carrera.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [CarreraController],
  providers: [CarreraService],
  imports: [TypeOrmModule.forFeature([Carrera])],
})
export class CarreraModule {}
