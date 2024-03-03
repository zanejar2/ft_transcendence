import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, VerifyCallback, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      //tokenURL: 'https://accounts.google.com/o/oauth2/auth',
      clientID: process.env.GOOGLE_ID_CLIENT, //process : objet global Node.js ...
      clientSecret: process.env.GOOGLE_CODE_SECRET,
      callbackURL: `http://${process.env.NEST_APP_HOST}/login_google`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = {
        googleId: profile.id,
        googleEmail: profile.emails[0].value,
        googleDisplayName: profile.displayName,
        googlePhoto: profile.photos[0].value,
      };
      return done(null, user);
    } catch (error) {
      throw new HttpException(
        'Error in google strategy',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
