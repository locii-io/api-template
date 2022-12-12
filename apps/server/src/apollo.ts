import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPlugin, ApolloServer } from '@apollo/server';
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';
import http from 'http';

const newRelicPlugin = createNewRelicPlugin<ApolloServerPlugin>({});

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        if (
          response.body.kind === 'single' &&
          response.body.singleResult.errors?.length &&
          !response.http?.status
        ) {
          response.http.status = 500;
        }
      },
    };
  },
};

export function configApollo(app, typeDefs, resolvers) {
  const httpServer = http.createServer(app);

  // Use Apollo Server as GraphQL middleware
  return new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [newRelicPlugin, setHttpPlugin, ApolloServerPluginDrainHttpServer({ httpServer })],
  });
}
