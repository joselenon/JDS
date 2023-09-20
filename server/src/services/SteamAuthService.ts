/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';

import URLS from '../config/constants/URLS';
import CREDENTIALS from '../config/constants/CREDENTIALS';

const session = require('express-session');
const passport = require('passport');
const passportSteam = require('passport-steam');

const SteamStrategy = passportSteam.Strategy;

export default class SteamAuthService {
  constructor(private app: express.Application) {
    this.initializePassport();
    this.setupMiddlewares();
  }

  private initializePassport() {
    passport.serializeUser((user: any, done: any) => {
      done(null, user);
    });
    passport.deserializeUser((user: any, done: any) => {
      done(null, user);
    });

    passport.use(
      new SteamStrategy(
        {
          // EDITED TO A RETURN URL WITHOUT PORT (PRODUCTION)
          returnURL: `${URLS.MAIN_URLS.SERVER_URL}${URLS.ENDPOINTS.AUTH.steam.callback}`, // Callback URL (full URL)
          realm: `${URLS.MAIN_URLS.SERVER_URL}/`, // Endpoint callback
          apiKey: CREDENTIALS.STEAM_CLIENT_SECRET,
        },
        (identifier: any, profile: any, done: any) => {
          process.nextTick(() => {
            profile.identifier = identifier;
            return done(null, profile);
          });
        },
      ),
    );
  }

  private setupMiddlewares() {
    this.app.use(
      session({
        secret: 'nmdaowsdkalvplvapofawmnfkawnfiowjf92fu29fjoajwdfja92ue12ud',
        saveUninitialized: true,
        resave: false,
        cookie: {
          maxAge: 3600000,
        },
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
