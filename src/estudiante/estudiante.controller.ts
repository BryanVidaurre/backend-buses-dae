// estudiante.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
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
    @Body('anio') anio: number,
    @Body('semestre') semestre: number,
  ) {
    return this.estudianteService.uploadExcel(file, anio, semestre);
  }
}
