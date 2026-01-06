import { Test, TestingModule } from '@nestjs/testing';
import { IngresoBusService } from './ingreso-bus.service';

describe('IngresoBusService', () => {
  let service: IngresoBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngresoBusService],
    }).compile();

    service = module.get<IngresoBusService>(IngresoBusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
