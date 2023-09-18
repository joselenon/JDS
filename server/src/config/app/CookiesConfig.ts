import JWTConfig from './JWTConfig';
import ICookieConfig from '../interfaces/ICookieConfig';

export const JWTCookie = {
  key: 'token',
  config: {
    maxAge: JWTConfig.expiration,
  },
};

export const CookiesConfig: ICookieConfig[] = [JWTCookie];
