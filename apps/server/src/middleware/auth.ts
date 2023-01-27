import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

export function authResolvers(resolvers) {
  const anonymousQueries = [];
  const anonymousMutations = ['createUser', 'login', 'loginWithToken'];

  Object.keys(resolvers.Query).forEach((key) => {
    if (!anonymousQueries.includes(key)) resolvers.Query[key] = authResolver(resolvers.Query[key]);
  });

  Object.keys(resolvers.Mutation).forEach((key) => {
    if (!anonymousMutations.includes(key))
      resolvers.Mutation[key] = authResolver(resolvers.Mutation[key]);
  });

  return resolvers;
}

function tryVerify(token) {
  try {
    if (!token) throw new Error();
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new GraphQLError('Authentication Token Invalid', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 403 },
      },
    });
  }
}
function authResolver(resolver) {
  return async (root, params, context) => {
    const authHeader = context.req?.headers?.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const auth = tryVerify(token);
      return resolver(root, params, {
        ...context,
        auth,
      });
    }
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  };
}
