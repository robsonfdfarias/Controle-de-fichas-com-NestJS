import { Injectable } from '@nestjs/common';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FichaService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentDate(){
    const data = new Date();
    const arr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', 
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', 
    '25', '26', '27', '28', '29', '30', '31'];
    const today = data.getFullYear()+'-'+arr[data.getMonth()]+'-'+data.getDate();
    return today;
  }

  async createIfNotExists(currentDate: string, localId: number): Promise<boolean>{
    const verify = await this.prisma.ficha.findFirst({
      where: {
        localId: localId,
        dateReg: currentDate
      }
    })
    console.log('Primeira verificação:')
    console.log(verify)
    if(verify!=null){
      return true;
    }
    const reg = await this.prisma.ficha.create({
      data: {
        localId: localId,
        defaultRecord: 0,
        priorityRecord: 0,
        dateReg: currentDate
      }
    });
    console.log('Segunda verificação:')
    console.log(reg)
    if(reg!=null){
      return true;
    }
    return false;
  }

  async generateRecordsTodayDefaultRecords(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    //verifica se o registro contendo a data atual e o local fornecido já existe na tabela, se não, ele o cria
    console.log(this.createIfNotExists(today, obj.localId))
    const {defaultRecord} = await this.prisma.ficha.update({
      where: {
        dateReg: today,
        localId: obj.localId
      },
      data: {
        defaultRecord: {
          increment: 1
        }
      }
    })
    console.log('Record default update. Current number:'+defaultRecord)
    return defaultRecord;
  }

  async generateRecordsTodayPriorityRecords(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    //verifica se o registro contendo a data atual e o local fornecido já existe na tabela, se não, ele o cria
    console.log('Resultado da verificação: '+this.createIfNotExists(today, obj.localId))
    const {priorityRecord} = await this.prisma.ficha.update({
      where: {
        dateReg: today,
        localId: obj.localId
      },
      data: {
        priorityRecord: {
          increment: 1
        }
      }
    })
    console.log('Record priority update. Current number:'+priorityRecord)
    return priorityRecord;
  }

  create(createFichaDto: CreateFichaDto) {
    return 'This action adds a new ficha';
  }

  findAll() {
    return `This action returns all ficha`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ficha`;
  }

  update(id: number, updateFichaDto: UpdateFichaDto) {
    return `This action updates a #${id} ficha`;
  }

  remove(id: number) {
    return `This action removes a #${id} ficha`;
  }
}
