import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  extractId42(user: any) {
    return user.username;
  }

  async set2FASecret(userId: number, secret: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { two_fa_secret: secret },
      });
    } catch (error) {
      console.error('Error setting 2FA secret: ', error);
    }
  }

  async generate2FASecret(user: any) {
    let secret: any;

    if (!user.two_fa_secret) {
      secret = authenticator.generateSecret();
      await this.set2FASecret(user.id, secret);
    } else secret = user.two_fa_secret;

    const otpauthUrl = authenticator.keyuri(user.email, 'TRENDENDEN', secret);

    return { secret, otpauthUrl };
  }

  async generateQrCode(user: any) {
    const otp = await this.generate2FASecret(user);
    return await toDataURL(otp.otpauthUrl);
  }

  async activate2FA(userId: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { ifauthenficate: true },
      });
    } catch (error) {
      console.error('Error enabling 2FA: ', error);
    }
  }

  async desactivate2FA(userId: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { ifauthenficate: false },
      });
    } catch (error) {
      console.error('Error disabling 2FA: ', error);
    }
  }

  is2FACodeValid(code: string, secret: string): boolean {
    return authenticator.verify({ token: code, secret: secret });
  }
}
