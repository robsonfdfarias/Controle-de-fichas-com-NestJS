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

  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('Init');
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    //   this.server.emit('msgToClient', {table: '01', type: 'Default', record: 0});
    //   this.server.emit('msgToClient', 'Retornou algo do servidor');
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
      this.server.emit('msgToClient', payload);
    }

    updateClient(data: any){
        this.server.emit('msgToClient', data);
    }
  }
  