import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events.gateway';
import { CallDto } from './dto/call.dto';
import * as shell from 'shelljs';
import * as fs from 'fs';

@Injectable()
export class FichaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway
  ) {
    this.verifyFile();
  }

  verifyFile(){
    const url = shell.pwd().stdout;
    const partes = url.split('/');
    if(partes[(partes.length-1)]=='fileRecords' || partes[(partes.length-1)]=='fileCall'){
      shell.cd ('../');
    }
    const fileFolder = 'fileCall'
    shell.mkdir('-p', fileFolder);
    shell.cd(fileFolder);
  }

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
    // console.log('Primeira verificação:')
    // console.log(verify)
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
    // console.log('Segunda verificação:')
    // console.log(reg)
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
        description: message,
        dateAction: new Date(Date.now())
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
    // console.log('Record default update. Current number:'+defaultRecord)
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
    const mesa = obj.mesa?obj.mesa:"01"
    console.log('->->->->->->->->->-.->')
    console.log(updateCall.defaultRecordCall)
    const call: CallDto = {record: updateCall.defaultRecordCall, table: mesa, type: "Default", localId: obj.localId}
    this.eventsGateway.updateClient(call);
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
    const mesa = obj.mesa?obj.mesa:"01"
    const call: CallDto = {record: updateCall.priorityRecordCall, table: mesa, type: "Priority", localId: obj.localId}
    this.eventsGateway.updateClient(call);
    await this.addLogOfActionUser("priorityRecordCall incrementado com sucesso. Ficha: "+updateCall.priorityRecordCall, "callPriorityRecord", obj.userRegistration)
    return updateCall.priorityRecordCall;
  }

  async showRecords(obj: UpdateFichaDto): Promise<any>{
    const today = this.getCurrentDate();
    // console.log(createFichaDto)
    const data = await this.prisma.fichaToLocal.findFirst({
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
    // console.log('+++++++++++++++++++++++++++++++++++++++')
    // console.log(data)
    return {
      defaultRecord: data.ficha.defaultRecord,
      defaultRecordCall: data.ficha.defaultRecordCall, 
      priorityRecord: data.ficha.priorityRecord, 
      priorityRecordCall: data.ficha.priorityRecordCall
    };
  }

  async getDefaultPriority(obj: UpdateFichaDto) {
    //logic call record
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    // console.log(obj)
    var dt = await this.showRecords(obj);
    //if o valor dentro do arquivo for menor que o limite determinado até a chamada da ficha priority
    var result= await this.getFileLocalId(obj.localId+'');
    if(result){
      // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
      // console.log(result);
      //chama a ficha default
      // console.log(dt)
      //verifica se existe ficha default para ser chamada
      if(dt.defaultRecord>dt.defaultRecordCall){
        // console.log('O DEFAULTRECORD É MAIOR DO QUE O DEFAULTRECORDCALL')
        await this.callDefaultRecord(obj);
      }else{
        // console.log('O DEFAULTRECORD NÃÃÃÃOOO É MAIOR DO QUE O DEFAULTRECORDCALL')
        await this.callPriorityRecord(obj);
      }
    }else{
      // console.log('RSRSRSRSRSRSRSRSRS')
      // console.log(result)
      // console.log(dt)
      //chama a ficha priority
      if(dt.priorityRecord>dt.priorityRecordCall){
        // console.log('O PRIORITYRECORD É MAIOR DO QUE O PRIORITYRECORDCALL');
        await this.callPriorityRecord(obj);
      }else{
        // console.log('O PRIORITYRECORD NÃÃÃÃOOO É MAIOR DO QUE O PRIORITYRECORDCALL');
        await this.callDefaultRecord(obj);
      }
    }
  }

  async getFileLocalId(localId: string){
    const fileName = this.generateFileNameOfController(localId);
    // console.log(fileName)
    //esta função verifique se estamos na pasta fileCall, que é a pasta onde deve ficar os arquivos de controle
    this.verifyFile();
    if(shell.test('-f', fileName)){
      // var valueControll: number = parseInt(this.readFileLocalId(fileName), 10) || 10;
      var valueControll = await this.readFileLocalId(fileName);
      //Define o controle de chamadas de fichas como sendo 2 default para 1 priority
      if(valueControll<2){
        valueControll++;
        this.writerFileLocalId(fileName, valueControll+'');
        return true;
      }else{
        valueControll = 0;
        this.writerFileLocalId(fileName, valueControll+'');
        return false;
      }
    }else{
      this.writerFileLocalId(fileName, '1');
      return true;
    }
  }

  async readFileLocalId(file: string){
    try{
      const data = await fs.promises.readFile(file, 'utf8');
      return parseInt(data);
    }catch(erro){
      console.log(erro);
      return 0;
    }
  }

  writerFileLocalId(fileName: string, content: string){
    shell.echo(content).to(fileName);
  }

  generateFileNameOfController(localId: string){
    const data = this.returnDateOfToday();
    return 'controller-call-localId_'+localId+'-data_'+data+'.txt';
  }
  returnDateOfToday(){
    const hoje = new Date();
    // Extrair o ano, mês e dia
    let ano = hoje.getFullYear();
    let mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então adicionamos 1
    let dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}_${mes}_${dia}`;
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
