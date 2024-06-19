import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { LocalModule } from './local/local.module';
import { FichaModule } from './record/ficha.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [LoginModule, LocalModule, FichaModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
