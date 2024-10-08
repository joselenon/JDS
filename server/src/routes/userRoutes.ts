import { Router } from 'express';

import UserController from '../controllers/http/UserController';
import URLS from '../config/constants/URLS';

const userRoutes = Router();

userRoutes.put(URLS.ENDPOINTS.USER.update, UserController.updateInfo);

export default userRoutes;
