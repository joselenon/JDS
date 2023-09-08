import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

import { errorResponse } from '../helpers/responseHelpers';
import { ClientError } from '../config/errorTypes/ClientErrors';
import { API_RESPONSE_MSGS } from '../config/constants';

const httpErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Sentry.captureException(err); // Captures errors to send to Sentry

  if (err instanceof ClientError) {
    res.status(err.getStatus()).json(errorResponse(err.message));
    return next();
  }

  // In case error is not instance of ClientError (displayable ones), throw a generic one
  res
    .status(500)
    .json(errorResponse(API_RESPONSE_MSGS.ERROR.CLIENT_ERROR_MSGS.GENERIC_MSG));
  return next();
};

export default httpErrorMiddleware;
