import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { FortyTwoStrategy } from './42.strategy';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [
    AuthService,
    FortyTwoStrategy,
    UserService,
    PrismaService,
    ConfigService
  ],
  exports: [AuthService],
})
export class AuthModule {}
