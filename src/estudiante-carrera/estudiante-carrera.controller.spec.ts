import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteCarreraController } from './estudiante-carrera.controller';
import { EstudianteCarreraService } from './estudiante-carrera.service';

describe('EstudianteCarreraController', () => {
  let controller: EstudianteCarreraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstudianteCarreraController],
      providers: [EstudianteCarreraService],
    }).compile();

    controller = module.get<EstudianteCarreraController>(EstudianteCarreraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
