import express from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import models from './models';
import authenticateToken from './middleware/auth';
import { login } from './controllers/login.controller';
import { ApolloServerPlugin, ApolloServer } from '@apollo/server';
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';

const newRelicPlugin = createNewRelicPlugin<ApolloServerPlugin>({});

export default function createServer() {
  console.log('Creating server...');

  const app = express();
  const httpServer = http.createServer(app);

  app.use(bodyParser.json());

  // Configure auth middleware
  app.use(authenticateToken);

  // Error handling route
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Use Apollo Server as GraphQL middleware
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      newRelicPlugin,
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  async function startApolloServer() {
    await apolloServer.start();

    // Initiate Sofa
    app.use(
      '/api',
      useSofa({
        basePath: '/api',
        schema,
        async context({ res }) {
          return {
            res,
            models,
          };
        },
        onRoute(info) {
          openApi.addRoute(info, {
            basePath: '/api',
          });
        },
      }),
    );

    // Initiate Apollo server middleware
    app.use(
      '/',
      cors<cors.CorsRequest>(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({
          models: models,
          token: authenticateToken,
        }),
      }),
    );
  }
  startApolloServer();

  const openApi = OpenAPI({
    schema,
    info: {
      title: 'Example API',
      version: '3.0.0',
    },
  });

  // Define route for OpenAPI docs
  const openApiDefinitions = openApi.get();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));

  // Define login route
  app.post('/login', login);

  return app;
}
