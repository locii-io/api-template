import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Mutation: {
    async login(
      root,
      { email, password },
      { models }
    ) {
      const user = await models.User.findOne({ where: { email } });

      // Handle when user doesn't exist
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'USER_NOT_FOUND', http: { status: 401 }
          },
        });
      }

      // Verify password
      const is_verified = await bcrypt.compare(password, user.password);

      // Handle invalid credentials
      if (!is_verified) {
        throw new GraphQLError('Invalid password', {
          extensions: {
            code: 'INVALID_PASSWORD', http: { status: 401 }
          },
        });
      }

      // Create token
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });

      return {
        ...payload,
        token
      };
    },
  },
};