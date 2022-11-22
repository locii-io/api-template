//import bcrypt from 'bcryptjs';

import { GraphQLError } from "graphql";

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
    async createCourse(root, { userId, name, points }, { models }) {
      return models.Course.create({ userId, name, points });
    },
    async updateCourse(root, { id, name, points }, { models }) {
      const course = await models.Course.findByPk(id);
      if (!course)
        throw new GraphQLError('Course not found', {
          extensions: {
            code: 'COURSE_NOT_FOUND',
            http: { status: 500 },
          },
        });
      course.set({
        name: name,
        points: points,
      });
      return course.save();
    },
    async deleteCourse(root, { id }, { models }) {
      const course = await models.Course.findByPk(id);
      if (!course)
        throw new GraphQLError('Course not found', {
          extensions: {
            code: 'COURSE_NOT_FOUND',
            http: { status: 500 },
          },
        });
      models.Course.destroy({ where: { id: id } });
      return course;
    },
  },
  Course: {
    async user(course) {
      return course.getUser();
    },
  },
};
