//import bcrypt from 'bcryptjs';

export const resolvers = {
  Query: {
    async courses(root, args, { models }) {
      return models.Course.findAll();
    },
    async courseById(root, { id }, { models }) {
      return models.Course.findByPk(id);
    },
  },
  Mutation: {
    async createCourse(
      root,
      { userId, name, points },
      { models }
    ) {
      return models.Course.create({ userId, name, points });
    },
    async updateCourse(root, { id, name, points }, { models }) {
      const course = await models.Course.findByPk(id);
      course.set({
        name: name,
        points: points,
      });
      return course.save();
    },
    async deleteCourse(root, { id }, { models }) {
      models.Course.destroy({ where: { id: id } });
      return "Course deleted successfully";
    },
  },
  Course: {
    async user(course) {
      return course.getUser();
    },
  },
};