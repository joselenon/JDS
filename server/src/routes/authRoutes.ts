// Novos métodos de login (Priority: ***)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const passport = require('passport');
import { Router } from 'express';

import AuthController from '../controllers/http/AuthController';
import URLS from '../config/constants/URLS';

const authRoutes = Router();

authRoutes.get(
  URLS.ENDPOINTS.AUTH.steam.initial,
  passport.authenticate('steam', { failureRedirect: '/' }),
  AuthController.steam,
);

authRoutes.get(
  URLS.ENDPOINTS.AUTH.steam.callback,
  passport.authenticate('steam', { failureRedirect: '/' }),
  AuthController.steamCallback,
);

export default authRoutes;
