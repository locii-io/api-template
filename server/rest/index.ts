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
      if (info.path !== '/empty')
        openApi.addRoute(info, {
          basePath: '/api',
        });
    },
    ignore: ['Query._empty', 'Mutation._empty'],
    routes: {
      'Query.users': {
        method: 'GET', path: '/users', responseStatus: 200, tags: ['User'],
        description: 'Get all users.'
      },
      'Query.userById': {
        method: 'GET', path: '/user/:id', responseStatus: 200, tags: ['User'],
        description: 'Get a user by the user id.'
      },
      'Mutation.createUser': {
        method: 'POST', path: '/user', responseStatus: 200, tags: ['User'],
        description: 'Get a user by the user id.'
      },
      'Mutation.updateUser': {
        method: 'PUT', path: '/user/:id', 'responseStatus': 200, tags: ['User'],
        description: 'Get a user by the user id.'
      },
      'Mutation.deleteUser': {
        method: 'DELETE', path: '/user/:id', responseStatus: 200, tags: ['User'],
        description: 'Get a user by the user id.'
      },

      'Query.courses': {
        method: 'GET', path: '/courses', responseStatus: 200, tags: ['Course'],
        description: 'Get all courses.'
      },
      'Query.courseById': {
        method: 'GET', path: '/course/:id', responseStatus: 200, tags: ['Course'],
        description: 'Get a course by the course id.'
      },
      'Mutation.createCourse': {
        method: 'POST', path: '/course', responseStatus: 200, tags: ['Course'],
        description: 'Get a course by the course id.'
      },
      'Mutation.updateCourse': {
        method: 'PUT', path: '/course/:id', 'responseStatus': 200, tags: ['Course'],
        description: 'Get a course by the course id.'
      },
      'Mutation.deleteCourse': {
        method: 'DELETE', path: '/course/:id', responseStatus: 200, tags: ['Course'],
        description: 'Get a course by the course id.'
      },
    }
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


