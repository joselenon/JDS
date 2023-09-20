import { CookieOptions } from 'express';

import JWTConfig from './JWTConfig';
import ICookieConfig from '../interfaces/ICookieConfig';
import CREDENTIALS from '../constants/CREDENTIALS';

export const JWTCookie = {
  key: 'token',
  config: {
    maxAge: JWTConfig.expiration,
    secure: true,
    domain: `.${CREDENTIALS.DOMAIN}.com`,
  } as CookieOptions,
};

export const CookiesConfig: ICookieConfig[] = [JWTCookie];
