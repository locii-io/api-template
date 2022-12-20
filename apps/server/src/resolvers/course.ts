//import bcrypt from 'bcryptjs';

import { GraphQLError } from 'graphql';
import { Context } from '../context';

export const resolvers = {
  Query: {
    async courses(root, args, { models }: Context) {
      return models.course.findMany();
    },
    async courseById(root, { id }, { models, handleModelError }: Context) {
      return models.course
        .findUnique({
          where: { id },
        })
        .then((result) => {
          if (!result)
            throw new GraphQLError('Course not found', {
              extensions: {
                code: 'COURSE_NOT_FOUND',
                http: { status: 500 },
              },
            });
          return result;
        })
        .catch(handleModelError);
    },
  },
  Mutation: {
    async createCourse(root, { userId, name, points }, { models, handleModelError }: Context) {
      return models.course.create({ data: { userId, name, points } }).catch(handleModelError);
    },
    async updateCourse(root, { id, name, points }, { models, handleModelError }: Context) {
      return models.course
        .update({
          where: { id },
          data: {
            name,
            points,
          },
        })
        .catch(handleModelError);
    },
    async deleteCourse(root, { id }, { models, handleModelError }: Context) {
      return models.course
        .delete({
          where: { id },
        })
        .catch(handleModelError);
    },
  },
  Course: {
    async user(course) {
      return course.getUser();
    },
  },
};
