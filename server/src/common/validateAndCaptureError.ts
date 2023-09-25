// Format errors occurred while request functions was being runned (If is not a ClientError, client is unable to know what happened)
import * as Sentry from '@sentry/node';

import { ClientError, GenericError } from '../config/errorTypes/ClientErrors';

const validateAndCaptureError = (err: unknown) => {
  if (err instanceof ClientError) throw err;
  Sentry.captureException(err);
  throw new GenericError();
};

export default validateAndCaptureError;
