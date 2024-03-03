import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.headers.cookie) {
          const cookies = req.headers.cookie.split('; ');
          const accessTokenCookie = cookies.find((cookie) =>
            cookie.startsWith('access_token='),
          );
          if (accessTokenCookie) {
            token = accessTokenCookie.split('=')[1];
          }
        }
        return token;
      },
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
  }
}
