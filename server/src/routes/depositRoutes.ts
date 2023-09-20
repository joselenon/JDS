import { Router } from 'express';

import DepositController from '../controllers/http/DepositController';
import URLS from '../config/constants/URLS';

const depositRoutes = Router();

depositRoutes.post(URLS.ENDPOINTS.DEPOSIT.code, DepositController.code);

export default depositRoutes;
