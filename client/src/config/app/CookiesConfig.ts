import ENVIRONMENT from '../constants/ENVIRONMENT';

export const JWTCookie = {
  key: 'token',
  config: {
    expires: 5 * 24 * 60 * 60, // 5 days (in seconds)
    secure: true,
    domain: ENVIRONMENT.REACT_APP_SERVER_DOMAIN /* Check this later*/,
  },
};
