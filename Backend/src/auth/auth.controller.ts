import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { jwtGuard } from './jwt/jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/auth/42')
  @UseGuards(AuthGuard('42'))
  async auth_42(@Req() req) {}

  @Get('/login')
  @UseGuards(AuthGuard('42'))
  async authCallback_42(@Req() req, @Res() res) {
    const user = await this.userService.findUserByemail(req.user.email);
    if (!user) {
      const user = await this.userService.createUser(req.user);
      const token = await this.userService.creatToken(req.user.email);
      res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' });
      res.redirect(process.env.HOME_URL);
    } else {
      const token = await this.userService.creatToken(user.email);
      res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict' });
      res.redirect(process.env.HOME_URL);
    }

    return {
      message: 'Authentification réussie!',
    };
  }

  @Get('auth/2fa/generate')
  @UseGuards(jwtGuard)
  async generate2FAQrCode(@Req() req, @Res() res) {
    const qr = await this.authService.generateQrCode(req.user);
    return res.send({ qr: qr });
  }

  @Post('auth/2fa/login')
  @UseGuards(jwtGuard)
  async auth2FA(@Req() req, @Body() body, @Res({ passthrough: true }) res) {
    const is2FACodeValid = this.authService.is2FACodeValid(
      body.number,
      req.user.two_fa_secret,
    );

    if (!is2FACodeValid)
    {
      console.log('OTP is invalid. Deny access.');
      return res.status(400).json({ message: 'OTP is invalid. Deny access.' });
    }

    const token = await this.userService.creatToken(req.user.email);
    res.cookie('access_token', `${token}`, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    return { success: true };
  }

  @Post('auth/2fa/turn-on')
  @UseGuards(jwtGuard)
  async turnOn2FA(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() body: any,
  ) {
    const is2FACodeValid = this.authService.is2FACodeValid(
      body.number,
      req.user.two_fa_secret,
    );

    if (!is2FACodeValid)
    {
      console.log('OTP is invalid. Deny access.');
      return res.status(400).json({ message: 'OTP is invalid. Deny access.' });
    }

    const token = await this.userService.creatToken(req.user.email);
    res.cookie('access_token', `${token}`, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    return await this.authService.activate2FA(req.user.id);
  }

  @Post('auth/2fa/turn-off')
  @UseGuards(jwtGuard)
  async turnOff2FA(@Req() req) {
    return await this.authService.desactivate2FA(req.user.id);
  }
}
