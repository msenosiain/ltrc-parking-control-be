import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { catchError, from, Observable } from 'rxjs';
import { AccessLogService, RegisterAccessResponse } from './access-log.service';
import { CreateAccessLogEntryDto } from './CreateAccessLogEntry.dto';

@Controller('access-log')
export class AccessLogController {
  constructor(private readonly accessLogService: AccessLogService) {}

  @Post()
  registerAccess(@Body() payload: CreateAccessLogEntryDto ): Observable<RegisterAccessResponse> {
    return from(this.accessLogService.registerAccess(payload.dni)).pipe(
      catchError((err) => {
        Logger.error('Error while registering member access', err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
