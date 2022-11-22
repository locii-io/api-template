import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import models from './models';
import { authResolvers } from './middleware/auth';
import { configREST } from './rest';
require('dotenv').config();

export default function createServer() {
  console.log('Creating server...');
  const app = express();

  // Configure auth middleware
  // Body parser causes errors in sofa
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  //app.use(authenticateToken);

  // Error handling route
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
    context,
    resolvers
  });
  async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
  }
  startApolloServer();

  // Initiate Sofa
  const rest = configREST({
    typeDefs,
    resolvers,
    context
  });
  app.use('/api', rest.sofa);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(rest.definitions));

  return app;
}
