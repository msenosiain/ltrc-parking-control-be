import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { catchError, Observable } from 'rxjs';
import { Member } from './schemas/member.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../common/services/excel.service';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  findAll(): Observable<Member[]> {
    return this.membersService.findAll();
  }

  @Get(':dni')
  searchByDni(@Param('dni') dni: string): Observable<Member> {
    return this.membersService.searchByDni(dni);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const jsonData = this.excelService.readExcelBuffer(file.buffer);
    const parsedMembers = jsonData.map((parsed: any) => {
      return {
        name: parsed.nombre,
        lastName: parsed?.apellido,
        dni: parsed.dni,
      } as Member;
    });
    return this.membersService.createMembers(parsedMembers).pipe(
      catchError((err) => {
        Logger.error('Error while inserting members', err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
