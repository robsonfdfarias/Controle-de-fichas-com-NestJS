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


  /* 
  enviar no corpo do post as informações abaixo
  {
    "localId": 1, //id do local
    "userRegistration": "Inserira aqui a matricula entre aspas"
  }
 */
  @Post('default')
  getDefaultRecords(@Body(ValidationPipe) obj: UpdateFichaDto) {
    return this.fichaService.generateRecordsTodayDefaultRecords(obj);
  }

  @Post('priority')
  getPriorityRecords(@Body(ValidationPipe) obj: UpdateFichaDto) {
    return this.fichaService.generateRecordsTodayPriorityRecords(obj);
  }

  @Post('callDefault')
  callDefaultRecord(@Body(ValidationPipe) obj: UpdateFichaDto){
    return this.fichaService.callDefaultRecord(obj);
  }

  @Post('callPriority')
  callPriorityRecord(@Body(ValidationPipe) obj: UpdateFichaDto){
    return this.fichaService.callPriorityRecord(obj);
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
