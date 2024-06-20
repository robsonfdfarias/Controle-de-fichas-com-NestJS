import { Module } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FichaController],
  providers: [FichaService, PrismaService],
})
export class FichaModule {}
