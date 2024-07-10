import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  create(@Body() createLoginDto: CreateLoginDto) {
    console.log('Dados de acesso:')
    console.log(createLoginDto.user)
    console.log(createLoginDto.password)
    return this.loginService.create(createLoginDto);
  }
  
  @Get('teste')
  teste(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.getDataUser('Danilo Packer', process.env.URL_INTEGRACAO+'/funcionarios/nome/'+'Danilo Packer'+'/ativos?completo=true');
  }
  

  // @Get()
  // findAll() {
  //   return this.loginService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loginService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLoginDto: UpdateLoginDto) {
  //   return this.loginService.update(+id, updateLoginDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loginService.remove(+id);
  // }
}
