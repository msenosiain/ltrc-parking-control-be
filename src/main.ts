import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const globalPrefix = '/api/v1';

  const app = await NestFactory.create(AppModule);

  Logger.log('Adding global prefix');
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') || 3000;
  await app.listen(port);

  Logger.log(`Listening at http://localhost:${port}${globalPrefix}`);
}

bootstrap();
