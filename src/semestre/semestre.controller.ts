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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SemestreService } from './semestre.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';

@ApiTags('Configuración Académica (Semestres)') // Agrupa el controlador en Swagger
@Controller('semestre')
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo periodo académico' })
  @ApiResponse({ status: 201, description: 'Semestre creado exitosamente.' })
  create(@Body() dto: CreateSemestreDto) {
    return this.semestreService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los semestres registrados' })
  findAll() {
    return this.semestreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un semestre por ID' })
  @ApiParam({ name: 'id', description: 'ID numérico del semestre' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.semestreService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar datos del semestre (ej. activar/desactivar)',
  })
  @ApiParam({ name: 'id', description: 'ID del semestre a modificar' })
  @ApiBody({ type: CreateSemestreDto, required: false })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSemestreDto>,
  ) {
    return this.semestreService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un semestre' })
  @ApiParam({ name: 'id', description: 'ID del semestre a eliminar' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.semestreService.remove(id);
  }
}
