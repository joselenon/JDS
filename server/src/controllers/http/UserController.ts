import { NextFunction, Request, Response } from 'express';

import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import { responseBody } from '../../helpers/responseHelpers';
import { JWTCookie } from '../../config/app/CookiesConfig';
import validateAuth from '../../common/validateAuth';
import { IUserUpdatePayload } from '../../config/interfaces/IUser';
import { InvalidPayloadError } from '../../config/errors/classes/SystemErrors';

class UserController {
  async updateInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization = null } = req.headers;
      const payload: IUserUpdatePayload = req.body;

      const isUserUploadInfoPayload = (obj: any): obj is IUserUpdatePayload => {
        return (
          typeof obj === 'object' && ('tradeLink' in obj || 'email' in obj)
        );
      };
      if (!isUserUploadInfoPayload(payload)) throw new InvalidPayloadError();

      const { userDocId } = await validateAuth(authorization);
      const docUpdated = await UserService.updateInfo(userDocId, payload);

      const newJWT = JWTService.signJWT(docUpdated);

      res.cookie(JWTCookie.key, newJWT, JWTCookie.config);
      return res.status(200).json(responseBody(true, 'UPDATE_MSG'));
    } catch (err) {
      return next(err);
    }
  }
}

export default new UserController();
