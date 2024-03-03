import { Module } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChannelMemberService, PrismaService],
  exports: [ChannelMemberService, PrismaService]
})
export class ChannelMemberModule {}
