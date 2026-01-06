import { Test, TestingModule } from '@nestjs/testing';
import { QrTokenController } from './qr-token.controller';
import { QrTokenService } from './qr-token.service';

describe('QrTokenController', () => {
  let controller: QrTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrTokenController],
      providers: [QrTokenService],
    }).compile();

    controller = module.get<QrTokenController>(QrTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
