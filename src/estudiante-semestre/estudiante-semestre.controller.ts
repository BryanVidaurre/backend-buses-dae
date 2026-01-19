import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EstudianteSemestreService } from './estudiante-semestre.service';
import { CreateEstudianteSemestreDto } from './dto/create-estudiante-semestre.dto';

@ApiTags('Asociación Estudiante-Semestre') // Nombre claro para la sección
@Controller('estudiante-semestre')
export class EstudianteSemestreController {
  constructor(private readonly estSemService: EstudianteSemestreService) {}

  @Post()
  @ApiOperation({
    summary: 'Asociar estudiante a un semestre',
    description:
      'Habilita a un estudiante para un periodo académico y carrera específica.',
  })
  @ApiResponse({
    status: 201,
    description: 'Asociación creada correctamente.',
    schema: {
      example: {
        id: 1,
        per_id: 1024,
        semestre_id: 5,
        car_cod_carrera: 120,
        estado: true,
      },
    },
  })
  create(@Body() dto: CreateEstudianteSemestreDto) {
    return this.estSemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asociaciones vigentes' })
  findAll() {
    return this.estSemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar una asociación específica' })
  @ApiParam({ name: 'id', description: 'ID de la asociación' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estSemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Modificar datos de la asociación (ej. cambiar estado)',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateEstudianteSemestreDto>,
  ) {
    return this.estSemService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar asociación' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estSemService.remove(id);
  }
}
