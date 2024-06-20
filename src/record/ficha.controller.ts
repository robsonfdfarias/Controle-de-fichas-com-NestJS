import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';

@Controller('ficha')
export class FichaController {
  constructor(private readonly fichaService: FichaService) {}

  @Post()
  create(@Body() createFichaDto: CreateFichaDto) {
    return this.fichaService.create(createFichaDto);
  }


  
  @Post('default')
  getDefaultRecords(@Body(ValidationPipe) obj: UpdateFichaDto) {
    return this.fichaService.generateRecordsTodayDefaultRecords(obj);
  }

  @Post('priority')
  getPriorityRecords(@Body(ValidationPipe) obj: UpdateFichaDto) {
    return this.fichaService.generateRecordsTodayPriorityRecords(obj);
  }



  @Get()
  findAll() {
    return this.fichaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFichaDto: UpdateFichaDto) {
    return this.fichaService.update(+id, updateFichaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichaService.remove(+id);
  }
}
