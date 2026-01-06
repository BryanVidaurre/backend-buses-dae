import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';

@Module({
  controllers: [BusController],
  providers: [BusService],
  imports: [TypeOrmModule.forFeature([Bus])],
})
export class BusModule {}
