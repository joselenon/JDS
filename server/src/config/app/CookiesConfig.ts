import { CookieOptions } from 'express';

import JWTConfig from './JWTConfig';
import ICookieConfig from '../interfaces/ICookieConfig';
import { URLS } from '../constants';

export const JWTCookie = {
  key: 'token',
  config: {
    maxAge: JWTConfig.expiration,
    secure: true,
    domain: URLS.MAIN_URLS.SERVER_URL,
    path: URLS.MAIN_URLS.CLIENT_URL,
  } as CookieOptions,
};

export const CookiesConfig: ICookieConfig[] = [JWTCookie];
