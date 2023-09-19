import { CookieOptions } from 'express';

import JWTConfig from './JWTConfig';
import ICookieConfig from '../interfaces/ICookieConfig';

export const JWTCookie = {
  key: 'token',
  config: {
    maxAge: JWTConfig.expiration,
    secure: true,
    domain: '.gamblance.com',
  } as CookieOptions,
};

export const CookiesConfig: ICookieConfig[] = [JWTCookie];
