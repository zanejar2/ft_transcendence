import { Module } from '@nestjs/common';
import { UserService } from './user.service';
// import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwtConstants';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UserService, JwtService, ConfigService],
  exports: [UserService, JwtService, ConfigService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '999h' },
    }),
  ],
})
export class UserModule {}
