import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';

function excludePassword<User>(user: User): Omit<User, 'password'> {
  if (user && user['password']) delete user['password'];
  return user;
}

export const resolvers = {
  Query: {
    async users(root, args, { models, handleModelError }) {
      return models.user.findMany().then(excludePassword).catch(handleModelError);
    },
    async userById(root, { id }, { models, handleModelError }) {
      return models.user
        .findUnique({
          where: { id },
        })
        .then((result) => {
          if (!result)
            throw new GraphQLError('User not found', {
              extensions: {
                code: 'USER_NOT_FOUND',
                http: { status: 500 },
              },
            });
          return result;
        })
        .then(excludePassword)
        .catch(handleModelError);
    },
  },
  Mutation: {
    async createUser(root, { name, email, password }, { models, handleModelError }) {
      return models.user
        .create({
          data: {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            isActive: true,
          },
        })
        .then(excludePassword)
        .catch(handleModelError);
    },
    async updateUser(root, { id, name, email }, { models, handleModelError }) {
      return models.user
        .update({
          where: { id },
          data: {
            name: name,
            email: email,
          },
        })
        .then(excludePassword)
        .catch(handleModelError);
    },
    async deleteUser(root, { id }, { models, handleModelError }) {
      return models.user
        .delete({
          where: { id },
        })
        .then(excludePassword)
        .catch(handleModelError);
    },
  },
  User: {
    async courses(user) {
      return []; //user.getCourses();
    },
  },
};
