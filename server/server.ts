import express from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import models from './models';
import { authenticationRequired, oidc } from './middlewares/okta';
import session from 'express-session';
import * as dotenv from 'dotenv';

dotenv.config();

export default function createServer() {
  console.log('Creating server...');

  const app = express();
  app.use(bodyParser.json());

  // Use Apollo Server as GraphQL middleware
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: { models },
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
      version: '1.0.0',
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

  app.use(
    session({
      secret: 'little-secret',
      resave: true,
      saveUninitialized: false,
    }),
  );
  app.use(oidc.router);
  app.get('/', oidc.ensureAuthenticated(), (req: any, res) => {
    res.send(`
      Hello ${req.userContext.userinfo.name}!
      <div>${JSON.stringify(req.userContext)}</div>
      <form method="POST" action="/logout">
        <button type="submit">Logout</button>
      </form>
    `);
  });

  app.get('/secure', authenticationRequired, (req: any, res) => {
    console.log(req.userContext);
    res.json(req.jwt);
  });
  app.get('/local-logout', (req: any, res) => {
    req.logout((err) => {
      console.log(err);
    });
  });

  const openApiDefinitions = openApi.get();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));

  return app;
}
