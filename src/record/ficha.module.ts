import { Module } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';

@Module({
  controllers: [FichaController],
  providers: [FichaService],
})
export class FichaModule {}
