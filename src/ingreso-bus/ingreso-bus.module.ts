import { Module } from '@nestjs/common';
import { IngresoBusService } from './ingreso-bus.service';
import { IngresoBusController } from './ingreso-bus.controller';
import { IngresoBus } from './entities/ingreso-bus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from 'src/bus/entities/bus.entity';
@Module({
  controllers: [IngresoBusController],
  providers: [IngresoBusService],
  imports: [TypeOrmModule.forFeature([IngresoBus, Bus])],
})
export class IngresoBusModule {}
