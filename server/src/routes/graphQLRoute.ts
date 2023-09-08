import { Router } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';

import context from '../config/graphql/context';
import { URLS } from '../config/constants';

const graphQLRoute = (apolloServer: ApolloServer) => {
  const graphQLRoutes = Router();

  graphQLRoutes.use(
    URLS.ENDPOINTS.GRAPHQL,
    cors(),
    bodyParser.json(),
    expressMiddleware(apolloServer, { context }),
  );

  return graphQLRoutes;
};

export default graphQLRoute;
