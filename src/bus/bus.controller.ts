import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateBusDto } from './dto/create-bus.dto';

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
}
