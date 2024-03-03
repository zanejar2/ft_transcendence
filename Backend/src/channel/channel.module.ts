/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChannelActionModule } from 'src/channel-action/channel-action.module';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelActionService } from 'src/channel-action/channel-action.service';
import { ConfigService } from '@nestjs/config';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [PrismaModule,
            JwtModule.register({}),
            ChannelMemberModule,
            ChannelActionModule,
            MessageModule],
  providers: [ChannelGateway,
              ChannelService,
              ChannelMemberService,
              UserService, 
              PrismaService, 
              JwtService,
              ChannelActionService,
              ConfigService,
              MessageService],
})
export class ChannelModule {}
