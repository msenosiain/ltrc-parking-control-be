import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { Model } from 'mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MembersService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async findAll(): Promise<Member[]> {
    return await this.memberModel.find().select('-_id').exec();
  }

  async getPaginated(paginationDto: PaginationDto) {
    const { page, limit, sortBy, sortOrder } = paginationDto;

    // Valor predeterminado si no se proporcionan valores para sortBy y sortOrder
    const sortField = sortBy || 'lastName';
    const order = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      this.memberModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: order })
        .exec(),
      this.memberModel.countDocuments().exec(),
    ]);

    return {
      data: members,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async searchByDni(dni: string): Promise<Member> {
    return await this.memberModel
      .findOne({ dni: new RegExp(dni, 'i') })
      .select('-_id')
      .exec();
  }

  async createMembers(members: Member[]): Promise<Member[]> {
    return await this.memberModel.insertMany(members);
  }
}
