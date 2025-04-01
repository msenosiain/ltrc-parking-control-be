import { Injectable } from '@nestjs/common';
import { addMinutes, isBefore } from 'date-fns';
import { AccessLogEntry } from './schemas/access-log-entry.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Member } from '../members/schemas/member.schema';

export interface RegisterAccessResponse {
  accessGranted: boolean;
  member: Member;
  title: string;
  subtitle: string;
}

@Injectable()
export class AccessLogService {
  constructor(
    @InjectModel(AccessLogEntry.name)
    private accessLogEntryModel: Model<AccessLogEntry>,
    private configService: ConfigService,
  ) {}

  async registerAccess(member: Member): Promise<RegisterAccessResponse> {
    const lastAccess = await this.accessLogEntryModel
      .findOne({ dni: member.dni })
      .sort({ createdAt: -1 });

    if (lastAccess) {
      const now = new Date();
      const threshold = this.configService.get<number>(
        'ACCESS_LOG_THRESHOLD',
        30,
      );
      const accessThreshold = addMinutes(lastAccess.createdAt, threshold);
      if (isBefore(now, accessThreshold)) {
        return {
          accessGranted: false,
          member,
          title: `Acceso Denegado para ${member.dni}`,
          subtitle: `${member.name} ${member.lastName}, debes esperar ${threshold} minutos antes de volver a ingresar`,
        };
      }
    }

    // Registrar un nuevo acceso
    const newAccess = new this.accessLogEntryModel({ dni: member.dni });
    await newAccess.save();

    return {
      accessGranted: true,
      member,
      title: `Hola ${member.name} ${member.lastName}!`,
      subtitle: 'Acceso registrado con éxito',
    };
  }
}
