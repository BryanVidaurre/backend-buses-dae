import { Test, TestingModule } from '@nestjs/testing';
import { IngresoBusController } from './ingreso-bus.controller';
import { IngresoBusService } from './ingreso-bus.service';

describe('IngresoBusController', () => {
  let controller: IngresoBusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngresoBusController],
      providers: [IngresoBusService],
    }).compile();

    controller = module.get<IngresoBusController>(IngresoBusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
