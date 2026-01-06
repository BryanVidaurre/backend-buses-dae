import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteCarreraService } from './estudiante-carrera.service';

describe('EstudianteCarreraService', () => {
  let service: EstudianteCarreraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstudianteCarreraService],
    }).compile();

    service = module.get<EstudianteCarreraService>(EstudianteCarreraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
