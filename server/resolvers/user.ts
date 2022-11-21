import bcrypt from 'bcryptjs';

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
      user.set({
        name: name,
        email: email,
      });
      return user.save();
    },
    async deleteUser(root, { id }, { models }) {
      return models.User.destroy({
        where: { id },
      });
    },
  },
  User: {
    async courses(user) {
      return user.getCourses();
    },
  },
};

