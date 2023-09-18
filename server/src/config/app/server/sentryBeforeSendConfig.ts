// Config to run before exception be computed in Sentry

import { Event } from '@sentry/node';

export default function sentryBeforeSendConfig(event: Event) {
  if (event.exception && event.exception.values) {
    const shouldFilter = event.exception.values.some((value) => {
      return value.type?.includes('Unknown Error'); // Add more error types if needed (||)
    });

    if (shouldFilter) {
      return null;
    }
  }

  return event;
}
