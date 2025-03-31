import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AccessLogService, RegisterAccessResponse } from './access-log.service';
import { CreateAccessLogEntryDto } from './CreateAccessLogEntry.dto';

@Controller('access-log')
export class AccessLogController {
  constructor(private readonly accessLogService: AccessLogService) {}

  @Post()
  async registerAccess(
    @Body() payload: CreateAccessLogEntryDto,
  ): Promise<RegisterAccessResponse> {
    try {
      return await this.accessLogService.registerAccess(payload.dni);
    } catch (err) {
      Logger.error('Error while registering member access', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
