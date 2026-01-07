import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestreService } from './semestre.service';
import { SemestreController } from './semestre.controller';
import { Semestre } from './entities/semestre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Semestre])],
  providers: [SemestreService],
  controllers: [SemestreController],
  exports: [SemestreService],
})
export class SemestreModule {}
