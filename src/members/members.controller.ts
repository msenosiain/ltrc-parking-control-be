import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './schemas/member.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../common/services/excel.service';
import {
  AccessLogService,
  RegisterAccessResponse,
} from '../access-log/access-log.service';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly excelService: ExcelService,
    private readonly accessLogService: AccessLogService,
  ) {}

  @Get()
  async findAll(): Promise<Member[]> {
    return await this.membersService.findAll();
  }

  @Get(':dni')
  async searchByDni(
    @Param('dni') dni: string,
  ): Promise<RegisterAccessResponse> {
    try {
      const member: Member = await this.membersService.searchByDni(dni);
      if (!member) {
        throw new NotFoundException(`Socio no encontrado con el DNI: ${dni}`);
      }

      return await this.accessLogService.registerAccess(member);
    } catch (err) {
      if (err.status === 404) {
        throw err;
      } else {
        Logger.error('Error while registering member access', err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Member[]> {
    try {
      const jsonData = this.excelService.readExcelBuffer(file.buffer);
      const parsedMembers = jsonData.map((parsed: any) => {
        return {
          name: parsed.nombre,
          lastName: parsed?.apellido,
          dni: parsed.dni,
        } as Member;
      });
      return await this.membersService.createMembers(parsedMembers);
    } catch (err) {
      Logger.error('Error while inserting members', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
