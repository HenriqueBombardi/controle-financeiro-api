import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que um front-end (web/mobile) em outro endereço consuma a API
  app.enableCors();

  // Valida automaticamente o corpo das requisições com base nos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não existem no DTO
      forbidNonWhitelisted: true, // retorna erro se enviarem campos desconhecidos
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`API rodando em http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
