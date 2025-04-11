import {
  ArgumentsHost,
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

    return response.status(exception.getStatus()).json(exception.getResponse());
  }
}
