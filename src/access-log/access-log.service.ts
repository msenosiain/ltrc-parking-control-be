import { Injectable } from '@nestjs/common';
import { addMinutes, isBefore } from 'date-fns';
import { AccessLogEntry } from './schemas/access-log-entry.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export interface RegisterAccessResponse {
  accessGranted: boolean;
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

  async registerAccess(dni: string): Promise<RegisterAccessResponse> {
    const lastAccess = await this.accessLogEntryModel
      .findOne({ dni })
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
          title: 'Acceso Denegado',
          subtitle: `Debes esperar ${threshold} minutos antes de volver a ingresar`,
        };
      }
    }

    // Registrar un nuevo acceso
    const newAccess = new this.accessLogEntryModel({ dni });
    await newAccess.save();

    return {
      accessGranted: true,
      title: 'Acceso registrado con éxito',
      subtitle: '',
    };
  }
}
