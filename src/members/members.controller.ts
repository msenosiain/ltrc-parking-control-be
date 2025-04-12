import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../common/services/excel.service';
import {
  AccessLogService,
  RegisterAccessResponse,
} from '../access-log/access-log.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schemas/member.schema';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly excelService: ExcelService,
    private readonly accessLogService: AccessLogService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() payload: CreateMemberDto): Promise<Member> {
    return await this.membersService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getMembers(@Query() paginationDto: PaginationDto) {
    return this.membersService.getPaginated(paginationDto);
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.USER)
  // async getMember(@Param('id') id: string): Promise<Member> {
  //   return this.membersService.get(id);
  // }

  @Get('/access/|:dni')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateMember: UpdateMemberDto,
  ): Promise<Member> {
    return this.membersService.update(id, updateMember);
  }
}
