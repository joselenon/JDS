import { Request, Response } from 'express';

import { JWTCookie } from '../../config/app/CookiesConfig';
import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import checkIfUserAlreadyExistsBySteamId from '../../common/checkIfUserAlreadyExistsBySteamId';
import { URLS } from '../../config/constants';
import { ISteamProfile } from '../../config/interfaces/ISteamProfile';

class AuthController {
  async steam(req: Request, res: Response) {
    return res.redirect('/');
  }

  async steamCallback(req: any, res: Response) {
    try {
      const steamPayload: ISteamProfile = req.user._json;
      const userExists = await checkIfUserAlreadyExistsBySteamId(
        steamPayload.steamid,
      );
      let userInfo;
      if (userExists) {
        userInfo = userExists;
      } else {
        const userCreated = await UserService.createUserThroughSteam(
          steamPayload,
        );
        userInfo = userCreated;
      }
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
