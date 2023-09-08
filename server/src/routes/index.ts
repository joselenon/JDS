import { Router } from 'express';

import httpErrorMiddleware from '../middlewares/httpErrorMiddleware';

import authRoutes from './authRoutes';
import externalAPIRoutes from './externalAPIRoutes';
import userRoutes from './userRoutes';
import depositRoutes from './depositRoutes';

const routes = Router();

routes.use('/', authRoutes);
routes.use('/', userRoutes);
routes.use('/', externalAPIRoutes);
routes.use('/', depositRoutes);

routes.use(httpErrorMiddleware);

export default routes;
