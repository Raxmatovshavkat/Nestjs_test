import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import {ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const port = process.env.DATABASE_PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  const config = new DocumentBuilder()
    .setTitle('Clean service')
    .setDescription('The clean service API description')
    .setVersion('1.0')
    .addTag('clean')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
