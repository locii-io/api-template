export const routes = {
  'Query.users': {
    method: 'GET',
    path: '/users',
    responseStatus: 200,
    tags: ['User'],
    description: 'Get all users.',
  },
  'Query.userById': {
    method: 'GET',
    path: '/user/:id',
    responseStatus: 200,
    tags: ['User'],
    description: 'Get a user by the user id.',
  },
  'Mutation.createUser': {
    method: 'POST',
    path: '/user',
    responseStatus: 200,
    tags: ['User'],
    description: 'Create a user.',
  },
  'Mutation.updateUser': {
    method: 'PUT',
    path: '/user/:id',
    responseStatus: 200,
    tags: ['User'],
    description: 'Update a user.',
  },
  'Mutation.deleteUser': {
    method: 'DELETE',
    path: '/user/:id',
    responseStatus: 200,
    tags: ['User'],
    description: 'Delete a user.',
  },
};
