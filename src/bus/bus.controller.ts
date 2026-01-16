import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post()
  create(@Body() dto: CreateBusDto) {
    return this.busService.create(dto);
  }

  @Get()
  findAll() {
    return this.busService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.busService.remove(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBusDto) {
    return this.busService.update(id, dto);
  }
}
