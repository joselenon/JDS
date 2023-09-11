import { NextFunction, Request, Response } from 'express';

import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import { responseBody } from '../../helpers/responseHelpers';
import { JWTCookie } from '../../config/app/CookiesConfig';
import validateAuth from '../../common/validateAuth';

class UserController {
  async updateInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization = null } = req.headers;
      const { userDocId } = await validateAuth(authorization);
      const docUpdated = await UserService.updateInfo(userDocId, req.body);
      const newJWT = JWTService.signJWT(docUpdated);
      res.cookie(JWTCookie.key, newJWT, JWTCookie.config);
      return res.status(200).json(responseBody(true, 'UPDATE_MSG'));
    } catch (err) {
      return next(err);
    }
  }
}

export default new UserController();
