// Initial Sentry configuration
import * as Sentry from '@sentry/node';
import express from 'express';

import { CREDENTIALS } from '../constants';
import sentryBeforeSendConfig from './server/sentryBeforeSendConfig';

const SentryConfig = (app: express.Application) => {
  return {
    dsn: CREDENTIALS.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({
        tracing: true,
      }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({
        app,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
    // Errors exception config
    beforeSend: sentryBeforeSendConfig,
  };
};

export default SentryConfig;
