import { makeExecutableSchema } from '@graphql-tools/schema';
import { useSofa, OpenAPI } from 'sofa-api';
import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
const basename = path.basename(__filename);

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

  const routes = {};
  fs
    .readdirSync(__dirname)
    .filter(file => file !== basename && /\.(j|t)s$/.test(file) && !/\.d\.(j|t)s$/.test(file))
    .forEach(file => merge(routes, require(path.join(__dirname, file)).routes));

  const sofa = useSofa({
    basePath: '/api',
    schema,
    context: { models },
    onRoute(info) {
      if (info.path !== '/empty')
        openApi.addRoute(info, {
          basePath: '/api',
        });
    },
    routes
  });

  const definitions = openApi.get();
  const query: any = definitions?.components?.schemas?.Query;
  if (query?.properties?._empty)
    delete query.properties._empty;
  const mutation: any = definitions?.components?.schemas?.Mutation;
  if (mutation?.properties?._empty)
    delete mutation.properties._empty;

  return {
    sofa,
    openApi,
    definitions: openApi.get(),
  }
}


