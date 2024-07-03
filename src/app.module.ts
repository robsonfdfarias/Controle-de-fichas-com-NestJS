import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LocalModule } from './local/local.module';
import { FichaModule } from './record/ficha.module';
import { LogsModule } from './logs/logs.module';
import { PrismaService } from './prisma/prisma.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [LoginModule, LocalModule, FichaModule, LogsModule],
  controllers: [],
  providers: [PrismaService, EventsGateway],
})
export class AppModule {}
