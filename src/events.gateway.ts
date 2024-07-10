// src/events.gateway.ts

import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as shell from 'shelljs';
import * as fs from 'fs';
import { CallDto } from './record/dto/call.dto';

// const url = shell.pwd().stdout;
// const partes = url.split('/');
// if(partes[(partes.length-1)]=='fileCall'){
//   shell.cd ('../');
// }
// const fileFolder = 'fileRecords'
// shell.mkdir('-p', fileFolder);
// shell.cd(fileFolder);


  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3001', //Libera o acesso a url indicada
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('Init');
    }
    
    verifyFile(){
      const url = shell.pwd().stdout;
      const partes = url.split('/');
      if(partes[(partes.length-1)]=='fileRecords' || partes[(partes.length-1)]=='fileCall'){
        shell.cd ('../');
      }
      const fileFolder = 'fileRecords'
      shell.mkdir('-p', fileFolder);
      shell.cd(fileFolder);
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      const localId = Number(client.handshake.headers.localid);
      const fileName = this.generateFileNameOfHist(localId);
      const keyName = 'msgToClient'+localId;
      console.log(`Client connected: ${client.id}`);
      this.verifyFile();
      if(shell.test('-f', fileName)){
        // console.log('O arquivo '+fileName+' existe...');
        let chama = 0;
        if(chama<1){
          this.readFile2(fileName, client, keyName);
          chama++;
        }
      }else{
        console.log('O arquivo '+fileName+' NÃO existe...');
      }
      // this.server.emit('msgToClient', {table: '01', type: 'Default', record: 0});
      // this.server.emit('msgToClient', 'Retornou algo do servidor');
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
      this.server.emit('msgToClient', payload);
    }

    updateClient(data: CallDto){
      this.server.emit('msgToClient'+data.localId, data);
      const fileName = this.generateFileNameOfHist(data.localId);
      // {record: data.record, table: data.table, type: data.type, localId: data.localId}
      this.verifyFile();
      shell.echo(`{"record": ${data.record}, "table": "${data.table}", "type": "${data.type}", "localId": ${data.localId}}`).toEnd(fileName);
    }

    generateFileNameOfHist(localId: number){
      const data = this.returnDateOfToday();
      return 'msgToClient-localId_'+localId+'-data_'+data+'.txt';
    }
    returnDateOfToday(){
      const hoje = new Date();
      // Extrair o ano, mês e dia
      let ano = hoje.getFullYear();
      let mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então adicionamos 1
      let dia = String(hoje.getDate()).padStart(2, '0');
      return `${ano}_${mes}_${dia}`;
    }

    readFile2(file: string, socket: Socket, keyNameChat: string){
      fs.readFile(file, 'utf8', (err, data) => {
        if(err){
          console.log(err);
          return;
        }
        const array = data.split('\n');
        // console.log('********************************************')
        var ar =[]
        for(let i=0; i<(array.length-1); i++){
          ar.unshift(JSON.parse(array[i]));
        }
        // console.log(ar)
        socket.emit(keyNameChat, ar);
      });
    }
  }
  