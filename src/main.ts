import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { envConfig } from '@helper/env.helpers';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@helper/error.helpers';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Nest-ELS Demo API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(envConfig.PORT || 3000);
}
bootstrap();
