import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EstudianteService } from './estudiante.service';
import { Semestre } from 'src/semestre/entities/semestre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('estudiante')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
    @InjectRepository(Semestre)
    private readonly semestreRepo: Repository<Semestre>,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('anio') anio: string,
    @Body('semestre') semestre: string,
  ) {
    if (!file) throw new BadRequestException('Archivo no recibido');
    if (!anio || !semestre)
      throw new BadRequestException('Año o semestre no proporcionado');

    const anioNum = Number(anio);
    const semestreStr = semestre.toString();

    let semestreEntity = await this.semestreRepo.findOne({
      where: { anio: anioNum, periodo: semestreStr },
    });

    if (!semestreEntity) {
      semestreEntity = this.semestreRepo.create({
        anio: anioNum,
        periodo: semestreStr,
        activo: true,
      });
      await this.semestreRepo.save(semestreEntity);
    }

    return this.estudianteService.uploadExcel(file, anioNum, semestreStr);
  }
}
