import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}

bootstrap();
