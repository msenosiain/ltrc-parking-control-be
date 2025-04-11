import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.name === 'MongoServerError') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
        error: exception.name,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
