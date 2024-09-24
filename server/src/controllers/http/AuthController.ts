import { NextFunction, Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';

import { JWTCookie } from '../../config/app/CookiesConfig';
import { ISteamProfile } from '../../config/interfaces/ISteamProfile';
import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import URLS from '../../config/constants/URLS';
import {
  checkIfUserAlreadyExistsByEmail,
  checkIfUserAlreadyExistsBySteamId,
} from '../../common/checkIfUserAlreadyExists';
import {
  InvalidPayloadError,
  UnavailableAuthMethod,
} from '../../config/errors/classes/SystemErrors';
import { firebaseApp } from '../..';
import { AuthError } from '../../config/errors/classes/ClientErrors';
import IGoogleProfile from '../../config/interfaces/IGoogleProfile';
import { responseBody } from '../../helpers/responseHelpers';
import { IS_LOGIN_VIA_STEAM_ALLOWED } from '../../config/logics/systemLogics';

class AuthController {
  async steam(req: Request, res: Response) {
    return res.redirect('/');
  }

  async steamCallback(req: any, res: Response) {
    try {
      if (!IS_LOGIN_VIA_STEAM_ALLOWED) throw new UnavailableAuthMethod();

      const steamPayload: ISteamProfile = req.user._json;

      const isSteamPayload = (obj: any): obj is ISteamProfile => {
        return (
          typeof obj === 'object' &&
          'steamid' in obj &&
          'personaname' in obj &&
          'avatarfull' in obj
        );
      };
      if (!isSteamPayload(steamPayload)) throw new InvalidPayloadError();

      const userExists = await checkIfUserAlreadyExistsBySteamId(
        steamPayload.steamid,
      );

      const userInfo = userExists
        ? userExists
        : await UserService.createUserThroughSteam(steamPayload);

      const genJWT = JWTService.signJWT(userInfo);

      res.cookie(JWTCookie.key, genJWT, JWTCookie.config);
      return res.redirect(URLS.MAIN_URLS.CLIENT_FULL_URL);
    } catch (err) {
      // Error being handled in different way cause this call comes from outside the client app
      res.redirect(URLS.MAIN_URLS.CLIENT_FULL_URL);
    }
  }

  async google(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken } = req.body;
      if (!accessToken) throw new InvalidPayloadError();

      const auth = getAuth(firebaseApp);

      const verifiedData = await auth.verifyIdToken(accessToken);
      if (!verifiedData) throw new AuthError();
      const isValidData = (obj: any): obj is IGoogleProfile => {
        return (
          typeof obj === 'object' &&
          'name' in obj &&
          'email' in obj &&
          'picture' in obj
        );
      };
      if (!isValidData(verifiedData)) throw new AuthError();

      const userExists = await checkIfUserAlreadyExistsByEmail(
        verifiedData.email,
      );
      const userInfo = userExists
        ? userExists
        : await UserService.createUserThroughGoogle(verifiedData);

      const genJWT = JWTService.signJWT(userInfo);

      return res.status(200).json(responseBody(true, 'LOGGED_IN', genJWT));
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
