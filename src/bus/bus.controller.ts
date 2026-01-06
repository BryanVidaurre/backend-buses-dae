import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
