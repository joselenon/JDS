import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';

import { JWTCookie } from '../config/app/CookiesConfig';

const local = '://jdsserverv1.gamblance.com/api/graphql';
const tokenFromCookies = Cookies.get(JWTCookie.key);

class GraphQLClientService {
  private httpLink;
  private wsLink;
  private splitLink;
  private apolloClient;

  constructor() {
    this.httpLink = new HttpLink({
      uri: `http${local}`,
    });
    this.wsLink = new GraphQLWsLink(
      createClient({
        url: `ws${local}`,
        // Set field 'connectionParams' in websocket connections
        connectionParams: { Authorization: `Bearer ${tokenFromCookies}` },
      }),
    );
    this.splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      this.wsLink,
      this.httpLink,
    );
    this.apolloClient = new ApolloClient({
      link: this.splitLink,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              getUser: {
                merge(_, incoming) {
                  return incoming;
                },
              },
            },
          },
          Subscription: {
            fields: {
              getBalance: {
                merge(_, incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
    });
  }

  getClient() {
    return this.apolloClient;
  }
}

export default new GraphQLClientService().getClient();
