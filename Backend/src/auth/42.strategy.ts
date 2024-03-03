import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.UID,
      clientSecret: process.env.SECRET,
      callbackURL: `http://${process.env.NEST_APP_HOST}/login`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const user = {
        intraId: profile.id,
        login: profile.username,
        email: profile.emails[0].value,
        username: profile.displayName,
        picture: profile._json.image.link,
      };
      return done(null, user);
    } catch (error) {
      throw new HttpException('Error in 42 strategy', HttpStatus.BAD_REQUEST);
    }
  }
}
