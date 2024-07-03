import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({origin: '*', methods: 'GET,POST,DELET,PUT'});
  app.use(cors({
    origin: 'http://localhost:3001', // permite requisições do localhost:3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // permite o envio de cookies
  }));
  await app.listen(3000);
}
bootstrap();
