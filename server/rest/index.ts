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
    }
  });

  return {
    sofa,
    openApi,
    definitions: openApi.get(),
  }
}


