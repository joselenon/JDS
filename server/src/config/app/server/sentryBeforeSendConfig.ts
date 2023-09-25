// Config to run before exception be computed in Sentry
import { Event } from '@sentry/node';

export default function sentryBeforeSendConfig(event: Event) {
  if (event.exception && event.exception.values) {
    const shouldFilter = event.exception.values.some((value) => {
      console.log('type aqui -->', value.type);
      return (
        value.type?.includes('Client Error') ||
        value.type?.includes('EXAMPLE ERROR ADDED')
      );
    });
    if (shouldFilter) {
      return null;
    }
  }

  return event;
}
