export const routes = {
  'Mutation.login': {
    method: 'POST',
    path: '/login',
    responseStatus: 200,
    tags: ['Authentication'],
    description: 'Login and get an authentication token.',
  },
  'Mutation.loginWithToken': {
    method: 'POST',
    path: '/login/token',
    responseStatus: 200,
    tags: ['Authentication'],
    description: 'Login with a provider token and get an authentication token.',
  },
};
