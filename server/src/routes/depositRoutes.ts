import { Router } from 'express';

import { URLS } from '../config/constants';
import DepositController from '../controllers/http/DepositController';

const depositRoutes = Router();

depositRoutes.post(URLS.ENDPOINTS.DEPOSIT.code, DepositController.code);

export default depositRoutes;
