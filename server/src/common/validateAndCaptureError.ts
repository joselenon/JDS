import * as Sentry from '@sentry/node';

import { ClientError, GenericError } from '../config/errorTypes/ClientErrors';

const validateAndCaptureError = (err: unknown) => {
  if (err instanceof ClientError) throw err;
  Sentry.captureException(err);
  throw new GenericError();
};

export default validateAndCaptureError;
