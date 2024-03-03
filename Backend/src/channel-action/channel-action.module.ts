import { Module } from '@nestjs/common';
import { ChannelActionService } from './channel-action.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChannelActionService, PrismaService]
})
export class ChannelActionModule {}
