import { Module } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events.gateway';

@Module({
  controllers: [FichaController],
  providers: [FichaService, PrismaService, EventsGateway],
})
export class FichaModule {}
