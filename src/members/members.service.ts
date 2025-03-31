import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { Model } from 'mongoose';

@Injectable()
export class MembersService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async findAll(): Promise<Member[]> {
    return await this.memberModel.find().select('-_id').exec();
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
