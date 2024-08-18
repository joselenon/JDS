import { NextFunction, Request, Response } from 'express';
import { responseBody } from '../../helpers/responseHelpers';
import validateAuth from '../../common/validateAuth';
import DepositService from '../../services/DepositService';

class DepositController {
  async code(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization = null } = req.headers;
      const payload = req.body;

      const { validatedJWTPayload } = await validateAuth(authorization);

      // Code validation and claim
      await DepositService.redeemCode(validatedJWTPayload.userDocId, payload);

      return res.status(200).json(responseBody(true, 'REDEEM_CODE_MSG'));
    } catch (err) {
      next(err);
    }
  }
}

export default new DepositController();
