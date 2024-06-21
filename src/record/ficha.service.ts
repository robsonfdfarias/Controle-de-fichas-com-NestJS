import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createIfNotExists(currentDate: string, localId: number): Promise<number>{
    const verify = await this.prisma.fichaToLocal.findFirst({
      where: {
        localId: localId,
        ficha: {
          dateReg: currentDate
        }
      }
    })
    console.log('Primeira verificação:')
    console.log(verify)
    if(verify!=null){
      return verify.fichaId;
    }
    const reg = await this.prisma.ficha.create({
      data: {
        defaultRecord: 0,
        defaultRecordCall: 0,
        priorityRecord: 0,
        priorityRecordCall: 0,
        dateReg: currentDate,
        fichaToLocal: {
          create: {
            localId: localId
          }
        }
      }
    });
    console.log('Segunda verificação:')
    console.log(reg)
    if(reg!=null){
      return reg.id;
    }
    return 0;
  }

  async addLogOfActionUser(message: string, action: string, userRegistration: string){
    const reg = await this.prisma.log.create({
      data: {
        matricula: userRegistration,
        action: action,
        dateAction: new Date(Date.now()),
        description: message
      }
    })
    // console.log(reg)
  }

  async generateRecordsTodayDefaultRecords(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    //verifica se o registro contendo a data atual e o local fornecido já existe na tabela, se não, ele o cria
    const idFicha = await this.createIfNotExists(today, obj.localId);
    if(idFicha<=0){
      await this.addLogOfActionUser("Erro ao tentar pegar ou criar automaticamente o registro do dia", "generateDefaultRecord", obj.userRegistration)
      throw new BadRequestException("Erro ao tentar atualizar a ficha padrão");
    }
    const {defaultRecord} = await this.prisma.ficha.update({
      where: {
        id: idFicha
      },
      data: {
        defaultRecord: {
          increment: 1
        }
      }
    })
    console.log('Data---->:'+new Date(Date.now()))
    await this.addLogOfActionUser("defaultRecord incrementado com sucesso. Ficha: "+defaultRecord, "generateDefaultRecord", obj.userRegistration)
    console.log('Record default update. Current number:'+defaultRecord)
    return defaultRecord;
  }

  async generateRecordsTodayPriorityRecords(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    //verifica se o registro contendo a data atual e o local fornecido já existe na tabela, se não, ele o cria
    const idFicha = await this.createIfNotExists(today, obj.localId);
    if(idFicha<=0){
      await this.addLogOfActionUser("Erro ao tentar pegar ou criar automaticamente o registro do dia", "generatePriorityRecord", obj.userRegistration)
      throw new BadRequestException("Erro ao tentar atualizar a ficha padrão");
    }
    const {priorityRecord} = await this.prisma.ficha.update({
      where: {
        id: idFicha
      },
      data: {
        priorityRecord: {
          increment: 1
        }
      }
    })
    await this.addLogOfActionUser("priorityRecord incrementado com sucesso. Ficha: "+priorityRecord, "generatePriorityRecord", obj.userRegistration)
    console.log('Record priority update. Current number:'+priorityRecord)
    return priorityRecord;
  }

  //Ao chamar a ficha padrão, ele verifica: 
  //- Se foi retirada alguma ficha hoje, 
  //- se a quantidade de ficha padrão é igual a quantidade de ficha padrão chamada
  //Se a primeira opção for NÃO ou a segunda opção for SIM, então ele retorna 0
  async callDefaultRecord(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    const checked = await this.prisma.fichaToLocal.findFirst({
      where: {
        localId: obj.localId,
        ficha: {
          dateReg: today
        }
      },
      include: {
        ficha: true
      }
    });
    if(checked==null || checked==undefined){
      return 0;
    }
    if(checked.ficha.defaultRecord<=checked.ficha.defaultRecordCall){
      return 0;
    }
    const updateCall = await this.prisma.ficha.update({
      where:{
        id: checked.ficha.id
      },
      data: {
        defaultRecordCall: {
          increment: 1
        }
      }
    })
    await this.addLogOfActionUser("defaultRecordCall incrementado com sucesso. Ficha: "+updateCall.defaultRecordCall, "callPriorityRecord", obj.userRegistration)
    return updateCall.defaultRecordCall;
  }

  //Ao chamar a ficha prioritária, ele verifica: 
  //- Se foi retirada alguma ficha hoje, 
  //- se a quantidade de ficha prioritária é igual a quantidade de ficha prioritária chamada
  //Se a primeira opção for NÃO ou a segunda opção for SIM, então ele retorna 0
  async callPriorityRecord(obj: UpdateFichaDto): Promise<number>{
    const today = this.getCurrentDate();
    const checked = await this.prisma.fichaToLocal.findFirst({
      where: {
        localId: obj.localId,
        ficha: {
          dateReg: today
        }
      },
      include: {
        ficha: true
      }
    });
    if(checked==null || checked==undefined){
      return 0;
    }
    if(checked.ficha.priorityRecord<=checked.ficha.priorityRecordCall){
      return 0;
    }
    const updateCall = await this.prisma.ficha.update({
      where:{
        id: checked.ficha.id
      },
      data: {
        priorityRecordCall: {
          increment: 1
        }
      }
    })
    await this.addLogOfActionUser("priorityRecordCall incrementado com sucesso. Ficha: "+updateCall.priorityRecordCall, "callPriorityRecord", obj.userRegistration)
    return updateCall.priorityRecordCall;
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
