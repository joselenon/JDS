import { Router } from 'express';

import YoutubeController from '../controllers/http/YoutubeController';
import { URLS } from '../config/constants';

const externalAPIsRoutes = Router();

externalAPIsRoutes.get(
  URLS.ENDPOINTS.EXTERNAL_APIS.youtube,
  YoutubeController.getLastVideos,
);

export default externalAPIsRoutes;
