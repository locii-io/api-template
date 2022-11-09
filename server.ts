import express from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './server/schema'
import { resolvers } from './server/resolvers';
import models from './server/models';

const app = express();
app.use(bodyParser.json());

// Use Apollo Server as GraphQL middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startServer();

// Initiate Sofa
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

app.use('/api', useSofa({
  basePath: '/api',
  schema,
  context: { models },
  onRoute(info) {
    openApi.addRoute(info, {
      basePath: '/api',
    });
  }
}
));

const openApiDefinitions = openApi.get();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));

// Start Express server
const port = 4000;
app.listen({ port }, () => {
  console.log(`Started server on port: ${port}`);
  console.log(`🚀 Apollo Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(`🚀 REST Server ready at http://localhost:${port}${server.graphqlPath}`);
});
