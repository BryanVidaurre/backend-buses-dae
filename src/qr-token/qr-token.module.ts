import { Module } from '@nestjs/common';
import { QrTokenService } from './qr-token.service';
import { QrTokenController } from './qr-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrToken } from './entities/qr-token.entity';
@Module({
  controllers: [QrTokenController],
  providers: [QrTokenService],
  imports: [TypeOrmModule.forFeature([QrToken])],
})
export class QrTokenModule {}
