import { Request, Response } from 'express';

import { JWTCookie } from '../../config/app/CookiesConfig';
import { ISteamProfile } from '../../config/interfaces/ISteamProfile';
import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import URLS from '../../config/constants/URLS';
import checkIfUserAlreadyExistsBySteamId from '../../common/checkIfUserAlreadyExistsBySteamId';
import { InvalidPayloadError } from '../../config/errors/classes/SystemErrors';

class AuthController {
  async steam(req: Request, res: Response) {
    return res.redirect('/');
  }

  async steamCallback(req: any, res: Response) {
    try {
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

      const jwtCreated = JWTService.signJWT(userInfo);

      res.cookie(JWTCookie.key, jwtCreated, JWTCookie.config);
      return res.redirect(URLS.MAIN_URLS.CLIENT_FULL_URL);
    } catch (err) {
      // Error being handled in different way cause this call comes from outside the client app
      return res.redirect(URLS.MAIN_URLS.CLIENT_FULL_URL);
    }
  }
}

export default new AuthController();
