import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

@Injectable()
export class MembersService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  findAll(): Observable<Member[]> {
    return from(this.memberModel.find().select('-_id').exec());
  }

  searchByDni(dni: string): Observable<Member> {
    return from(
      this.memberModel
        .findOne({ dni: new RegExp(dni, 'i') })
        .select('-_id')
        .exec(),
    );
  }

  createMembers(members: Member[]): Observable<Member[]> {
    return from(this.memberModel.insertMany(members));
  }
}
