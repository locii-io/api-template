require('dotenv').config();
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { authResolvers } from './middleware/auth';
import { configREST } from './rest';
import { configApollo } from './apollo';
import { context } from './context';
import { configStych } from './lib/stytch';
import { authProviders } from './resolvers/login';

export default function createServer() {
  console.log('Creating server...');
  const app = express();

  // Error handling route
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  authResolvers(resolvers);
  const apolloServer = configApollo(app, typeDefs, resolvers);

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
        context,
      })
    );
  }
  startApolloServer();
  configStych(authProviders);

  return app;
}
