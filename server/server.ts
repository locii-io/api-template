import express from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import models from './models';
import authenticateToken from './middleware/auth';
import { login } from './controllers/login.controller';

require('dotenv').config();

export default function createServer() {
  console.log('Creating server...');

  const app = express();
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
    context: { models, authenticateToken },
  });
  async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
  }
  startApolloServer();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const openApi = OpenAPI({
    schema,
    info: {
      title: 'Example API',
      version: '3.0.0',
    },
  });

  // Initiate Sofa
  app.use(
    '/api',
    useSofa({
      basePath: '/api',
      schema,
      context: { models },
      onRoute(info) {
        openApi.addRoute(info, {
          basePath: '/api',
        });
      },
    }),
  );

  // Define route for OpenAPI docs
  const openApiDefinitions = openApi.get();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));

  // Define login route
  app.post('/login', login);

  return app;
}
