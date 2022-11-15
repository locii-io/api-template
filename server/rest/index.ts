import { makeExecutableSchema } from '@graphql-tools/schema';
import { useSofa, OpenAPI } from 'sofa-api';

export function configREST(typeDefs, resolvers, models) {
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

  const sofa = useSofa({
    basePath: '/api',
    schema,
    context: { models },
    onRoute(info) {
      openApi.addRoute(info, {
        basePath: '/api',
      });
    },
    routes: {
      "Query.userById": { "method": "GET", "path": "/user/:id", "responseStatus": 200 },
      "Mutation.createUser": { "method": "POST", "path": "/user", "responseStatus": 200 },
      "Mutation.updateUser": { "method": "PUT", "path": "/user/:id", "responseStatus": 200 },
      "Mutation.deleteUser": { "method": "DELETE", "path": "/user/:id", "responseStatus": 200 },
    }
  });

  return {
    sofa,
    openApi,
    definitions: openApi.get(),
  }
}


