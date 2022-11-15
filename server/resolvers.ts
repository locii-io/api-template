//import bcrypt from 'bcryptjs';

export const resolvers = {
    Query: {
        async users(root, args, { models }) {
            return models.User.findAll();
        },
        async userById(root, { id }, { models }) {
            return models.User.findByPk(id);
        },
        async courses(root, args, { models }) {
            return models.Course.findAll();
        },
        async courseById(root, { id }, { models }) {
            return models.Course.findByPk(id);
        },
    },
    Mutation: {
        async createUser(root, { name, email, password }, { models }) {
            return models.User.create({
                name,
                email,
                password, //: await bcrypt.hash(password, 10),
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
            models.User.destroy({ where: { id: id } });
            return "User deleted successfully";
        },

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