import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';

@Controller('semestre')
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) {}

  @Post()
  create(@Body() dto: CreateSemestreDto) {
    return this.semestreService.create(dto);
  }

  @Get()
  findAll() {
    return this.semestreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.semestreService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateSemestreDto>) {
    return this.semestreService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.semestreService.remove(Number(id));
  }
}
