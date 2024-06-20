import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LocalModule } from './local/local.module';
import { FichaModule } from './record/ficha.module';
import { LogsModule } from './logs/logs.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [LoginModule, LocalModule, FichaModule, LogsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
