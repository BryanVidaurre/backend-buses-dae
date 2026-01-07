import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EstudianteSemestreService } from './estudiante-semestre.service';
import { CreateEstudianteSemestreDto } from './dto/create-estudiante-semestre.dto';

@Controller('estudiante-semestre')
export class EstudianteSemestreController {
  constructor(private readonly estSemService: EstudianteSemestreService) {}

  @Post()
  create(@Body() dto: CreateEstudianteSemestreDto) {
    return this.estSemService.create(dto);
  }

  @Get()
  findAll() {
    return this.estSemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.estSemService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: Partial<CreateEstudianteSemestreDto>,
  ) {
    return this.estSemService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.estSemService.remove(Number(id));
  }
}
