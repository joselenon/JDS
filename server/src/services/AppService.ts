import * as Sentry from '@sentry/node';
import express from 'express';

import { GraphQLSchema } from 'graphql';
import { Disposable } from 'graphql-ws';
import { ApolloServer } from '@apollo/server';
import { Server, createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { sentryPlugin } from '../config/app/server/requestDidStartPlugin';
import { typeDefs, resolvers } from '../graphql';
import { wsContext } from '../config/graphql/context';
import { JackpotManagerProtocol } from '../config/interfaces/jackpotManager';
import serverWillStartPlugin from '../config/app/server/serverWillStartPlugin';
import webSocketServerConfig from '../config/app/server/webSocketServerConfig';
import SentryConfig from '../config/app/SentryConfig';
import formatError from '../config/graphql/formatError';
import SteamAuthService from './SteamAuthService';

import routes from '../routes';
import graphQLRoute from '../routes/graphQLRoute';
import corsMiddleware from '../middlewares/corsMiddleware';
import {
  expressJSONMiddleware,
  expressURLEncodedMiddleware,
} from '../middlewares/expressMiddlewares';
import {
  errorHandlerMiddleware,
  requestHandlerMiddleware,
  tracingHandlerMiddleware,
} from '../middlewares/sentryMiddlewares';
import { URLS } from '../config/constants';

class AppService {
  private app: express.Application;
  private httpServer: Server;
  private wsServer: WebSocketServer;
  private schema: GraphQLSchema;
  private serverCleanup: Disposable;
  private apolloServer: ApolloServer;
  private jackpotManager: JackpotManagerProtocol;

  constructor() {
    this.app = express();

    /* SENTRY */
    Sentry.init(SentryConfig(this.app));

    this.httpServer = createServer(this.app);
    this.schema = makeExecutableSchema({ typeDefs, resolvers });
    this.wsServer = new WebSocketServer(webSocketServerConfig(this.httpServer));
    this.serverCleanup = useServer(
      {
        schema: this.schema,
        // Config. to set context in subscriptions
        context: async (ctx: any) => await wsContext(ctx),
      },
      this.wsServer,
    );
    this.apolloServer = new ApolloServer({
      schema: this.schema,
      formatError,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
        serverWillStartPlugin(this.serverCleanup),
        sentryPlugin(),
      ],
    });
    this.jackpotManager = {
      jackpotAnimationDurationInMs: 15,
      jackpotDurationInMs: 15,
    };
  }

  private setupMiddlewares(): void {
    this.app.use(corsMiddleware());
    this.app.use(expressJSONMiddleware());
    this.app.use(expressURLEncodedMiddleware());

    /* SENTRY */
    this.app.use(requestHandlerMiddleware());
    this.app.use(tracingHandlerMiddleware());
  }

  private setupEndpoints(): void {
    this.app.use(graphQLRoute(this.apolloServer));
    this.app.use('/', routes);
    this.app.use(errorHandlerMiddleware()); // Final Sentry middleware
  }

  public async initialize() {
    this.setupMiddlewares();
    new SteamAuthService(this.app);
    await this.apolloServer.start();
    this.setupEndpoints();

    this.wsServer.on('listening', () =>
      console.log('Web-socket server started.'),
    );
    this.httpServer.listen(URLS.MAIN_URLS.SERVER_PORT, () =>
      console.log(`Server started, ${URLS.MAIN_URLS.SERVER_URL}`),
    );
  }
}

export default new AppService();

/*
    private setupWebSocket(): void {
      this.wsServer.on('connection', (socket) => {
        console.log('nova conexão');
      });

      this.wsServer.on('close', (socket) => {
        console.log('conexão encerrada.');
      });
    }
   */
