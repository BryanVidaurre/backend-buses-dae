import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@ApiTags('Buses') // Agrupa este controlador en la sección de Buses
@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo recorrido de bus' })
  @ApiResponse({
    status: 201,
    description: 'Bus/Recorrido creado exitosamente.',
  })
  create(@Body() dto: CreateBusDto) {
    return this.busService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de buses (Agrupados)',
    description:
      'Retorna una lista de patentes únicas con estado activo (deleted: false) para el selector de la App móvil.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de buses recuperada.',
    schema: {
      example: [{ bus_patente: 'ABCD-12' }, { bus_patente: 'XYZZ-99' }],
    },
  })
  findAll() {
    return this.busService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un bus/recorrido' })
  @ApiParam({ name: 'id', description: 'ID del registro de bus' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado correctamente.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBusDto) {
    return this.busService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminado lógico de un bus' })
  @ApiParam({ name: 'id', description: 'ID del registro a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Bus marcado como eliminado (deleted: true).',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.busService.remove(id);
  }
}
