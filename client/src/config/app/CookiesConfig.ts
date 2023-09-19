export const JWTCookie = {
  key: 'token',
  config: {
    maxAge: 5 * 24 * 60 * 60, // 5 days (in seconds)
    secure: true,
    domain: 'jdsserverv1.gamblance.com',
  },
};
