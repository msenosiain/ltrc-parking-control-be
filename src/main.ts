import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  Logger.log('Enabling CORS');
  const corsAllowedOrigins = configService.get('API_CORS_ALLOWED_ORIGINS', '');
  const corsAllowedOriginsArray = corsAllowedOrigins
    .split(',')
    .map((item) => item.trim());
  app.enableCors({ origin: corsAllowedOriginsArray, credentials: true });

  Logger.log('Adding global prefix');
  const globalPrefix = configService.get<string>(
    'API_GLOBAL_PREFIX',
    '/api/v1',
  );
  app.setGlobalPrefix(globalPrefix);

  const port = configService.get<number>('API_PORT') || 3000;
  await app.listen(port);

  Logger.log(`Listening at http://localhost:${port}${globalPrefix}`);
}

bootstrap();
