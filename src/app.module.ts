import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessLogModule } from './access-log/access-log.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

export const configSchema = Joi.object({
  API_PORT: Joi.number().integer().required(),
  API_GLOBAL_PREFIX: Joi.string().required(),
  API_CORS_ALLOWED_ORIGINS: Joi.string().required(),
  MONGODB_URI: Joi.string().required(),
  ACCESS_LOG_THRESHOLD: Joi.number().integer().required(),
  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_AUTH_REDIRECT_URL: Joi.string().required(),
  GOOGLE_AUTH_ALLOWED_DOMAIN: Joi.string().required(),
  GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),
  GOOGLE_AUTH_JWT_SECRET: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/ltrc-parking-control',
        ),
      }),
    }),
    MembersModule,
    AccessLogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
