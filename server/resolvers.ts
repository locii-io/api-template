import { hashPassword } from './utils/index';
import AppAnalytics from './services/analytics';

const appAnalytics = new AppAnalytics();

export const resolvers = {
  Query: {
    async users(root, args, { models }) {
      return await models.User.findAll();
    },
    async userById(root, { id }, { models }) {
      return await models.User.findByPk(id);
    },
    async courses(root, args, { models }) {
      return await models.Course.findAll();
    },
    async courseById(root, { id }, { models }) {
      return await models.Course.findByPk(id);
    },
  },
  Mutation: {
    async createUser(root, { name, email, password }, { models }) {
      const newUser = await models.User.create({
        name,
        email,
        password: await hashPassword(password),
        isActive: true,
      });

      // Analytics Identify
      const userId = newUser.dataValues.id;
      const traits = {
        name: name,
        email: email,
      };
      appAnalytics.identify(userId, traits);

      // Analytics Track
      appAnalytics.track(userId, 'User Created', traits);

      return newUser;
    },
    async updateUser(root, { id, name, email }, { res, models }) {
      try {
        // Analytics Track
        appAnalytics.track(res.locals.authUserId, 'User Updated', {
          userId: id,
        });
      } catch (e) {}

      const user = await models.User.findByPk(id);
      if (!user) {
        return 'User not found';
      } else {
        const newData = {
          name: name,
          email: email,
        };
        user.set(newData);

        return user.save();
      }
    },
    async deleteUser(root, { id }, { res, models }) {
      try {
        // Analytics Track
        appAnalytics.track(res.locals.authUserId, 'User Deleted', {
          userId: id,
        });
      } catch (e) {}

      const user = await models.User.findByPk(id);
      if (!user) {
        return 'User not found';
      } else {
        await models.User.destroy({ where: { id: id } });
        return 'User deleted successfully';
      }
    },

    async createCourse(root, { userId, name, points }, { res, models }) {
      const data = { userId, name, points };
      const newCourse = await models.Course.create(data);

      // Get authenticated User ID
      const authUserId = res.locals.authUserId;

      // Analytics Track
      appAnalytics.track(authUserId, 'Course Created', data);

      return newCourse;
    },
    async updateCourse(root, { id, name, points }, { res, models }) {
      const newData = {
        name: name,
        points: points,
      };
      const course = await models.Course.findByPk(id);
      course.set(newData);

      // Get authenticated User ID
      const authUserId = res.locals.authUserId;

      // Analytics Track
      appAnalytics.track(authUserId, 'Course Updated', { courseId: id });

      return course.save();
    },
    async deleteCourse(root, { id }, { res, models }) {
      await models.Course.destroy({ where: { id: id } });

      // Get authenticated User ID
      const authUserId = res.locals.authUserId;

      // Analytics Track
      appAnalytics.track(authUserId, 'Course Deleted', { userId: id });

      return 'Course deleted successfully';
    },
  },
  User: {
    async courses(user) {
      return user.getCourses();
    },
  },
  Course: {
    async user(course) {
      return course.getUser();
    },
  },
};
