// Control who's allowed to make requests on this application
import cors from 'cors';

import { URLS } from '../config/constants';

export default function corsMiddleware() {
  return cors({ origin: URLS.MAIN_URLS.CLIENT_URL, credentials: true });
}
