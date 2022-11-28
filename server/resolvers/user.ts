import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    async users(root, args, { models }) {
      return models.User.findAll();
    },
    async userById(root, { id }, { models }) {
      return models.User.findByPk(id);
    },
  },
  Mutation: {
    async createUser(root, { name, email, password }, { models }) {
      return models.User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        isActive: true,
      });
    },
    async updateUser(root, { id, name, email }, { models }) {
      const user = await models.User.findByPk(id);
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'USER_NOT_FOUND',
            http: { status: 500 },
          },
        });
      user.set({
        name: name,
        email: email,
      });
      return user.save();
    },
    async deleteUser(root, { id }, { models }) {
      const user = await models.User.findByPk(id);
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'USER_NOT_FOUND',
            http: { status: 500 },
          },
        });
      await models.User.destroy({
        where: { id },
      });
      return user;
    },
  },
  User: {
    async courses(user) {
      return user.getCourses();
    },
  },
};
