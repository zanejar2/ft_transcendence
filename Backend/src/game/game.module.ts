import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { HistoryService } from './history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GameGateway, GameService, JwtService, HistoryService, PrismaService],
})
export class GameModule {}
