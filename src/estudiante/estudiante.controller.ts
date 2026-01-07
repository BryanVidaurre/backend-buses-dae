// estudiante.controller.ts
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
import { File as MulterFile } from 'multer';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: MulterFile,
    @Body('anio') anio: string,
    @Body('semestre') semestre: string,
  ) {
    if (!semestre) {
      throw new BadRequestException('Semestre no encontrado');
    }

    const anioNum = Number(anio);
    const semestreNum = Number(semestre);

    return this.estudianteService.uploadExcel(file, anioNum, semestreNum);
  }
}
