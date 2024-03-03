import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user/user.service';
import { Request } from 'express';
import { jwtGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/user/dto/user.req.dto';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(jwtGuard)
  @Get('/home')
  async home(@Req() req: Request & { user: User }) {
    const userr = {
      picture: req.user.picture,
      login: req.user.login,
    };

    return userr;
  }
}
