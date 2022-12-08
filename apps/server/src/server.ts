require('dotenv').config();
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as swaggerUi from 'swagger-ui-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import models from './models';
import { ApolloServerPlugin, ApolloServer } from '@apollo/server';
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';
import { authResolvers } from './middleware/auth';
import { configREST } from './rest';

const newRelicPlugin = createNewRelicPlugin<ApolloServerPlugin>({});

export default function createServer() {
  console.log('Creating server...');
  const app = express();
  const httpServer = http.createServer(app);

  // Error handling route
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  const context = async ({ req }) => {
    return { models, req };
  };

  authResolvers(resolvers);
  // Use Apollo Server as GraphQL middleware
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      newRelicPlugin,
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  // Initiate Sofa
  const rest = configREST({
    typeDefs,
    resolvers,
    context,
  });

  async function startApolloServer() {
    await apolloServer.start();

    app.use('/api', rest.sofa);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(rest.definitions));

    // Body parser causes errors in sofa so must c ome after
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Initiate Apollo server middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      expressMiddleware(apolloServer, {
        context
      }),
    );
  }
  startApolloServer();

  return app;
}