import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { FortyTwoStrategy } from './auth/42.strategy';
// import { GoogleStrategy } from './auth/google.strategy';
// import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
// import { jwtConstants } from './auth/jwtConstants';
// import { AuthService } from './auth/auth.service';
// import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtStrategy } from './auth/jwt/jwt.strategy';
import { ChannelModule } from './channel/channel.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { ChannelActionModule } from './channel-action/channel-action.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { FortyTwoStrategy } from './auth/42.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    GameModule,
    JwtModule.register({}),
    ChannelModule,
    ChannelMemberModule,
    ChannelActionModule,
    MessageModule,
    MulterModule.register({ dest: '../uploads' }),
    ServeStaticModule.forRoot({
      rootPath: '/Backend/uploads/',
      renderPath: '/Backend/uploads/',
      // rootPath: join(__dirname, '..', 'uploads'),
    }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [
    AppService,
    FortyTwoStrategy,
    JwtService,
    jwtStrategy,
  ],
})
export class AppModule {}
