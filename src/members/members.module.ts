import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schemas/member.schema';
import { CommonModule } from '../common/common.module';
import { AccessLogModule } from '../access-log/access-log.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    AccessLogModule,
  ],
  providers: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
