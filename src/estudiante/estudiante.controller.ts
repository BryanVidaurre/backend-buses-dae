import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { EstudianteService } from './estudiante.service';
import { Semestre } from 'src/semestre/entities/semestre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Estudiantes') // 1. Esto agrupa el controlador en la UI
@Controller('estudiante')
export class EstudianteController {
  constructor(
    private readonly estudianteService: EstudianteService,
    @InjectRepository(Semestre)
    private readonly semestreRepo: Repository<Semestre>,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // 2. Indica que es subida de archivos
  @ApiOperation({ summary: 'Cargar estudiantes masivamente desde Excel' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo Excel (.xlsx)',
        },
        anio: { type: 'string', example: '2024', description: 'Año académico' },
        semestre: {
          type: 'string',
          example: '1',
          description: 'Periodo (1 o 2)',
        },
      },
      required: ['file', 'anio', 'semestre'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Procesamiento de archivo iniciado.',
  })
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

  @Post('notificar-masivo')
  @ApiOperation({ summary: 'Enviar correo masivo a todos los estudiantes' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        asunto: { type: 'string', example: 'Actualización de Pase Digital' },
        mensaje: {
          type: 'string',
          example: 'Estimados, el pase ha sido actualizado...',
        },
      },
      required: ['asunto', 'mensaje'],
    },
  })
  @ApiResponse({ status: 200, description: 'Correos enviados exitosamente.' })
  async enviarNotificacion(@Body() body: { asunto: string; mensaje: string }) {
    if (!body.asunto || !body.mensaje) {
      throw new BadRequestException('Asunto y mensaje son requeridos');
    }
    return await this.estudianteService.enviarNotificacionMasiva(
      body.asunto,
      body.mensaje,
    );
  }
}
