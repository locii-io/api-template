import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const context = async ({ req }) => {
  return {
    models: prisma,
    handleModelError: (error) => {
      throw new GraphQLError(
        error?.meta?.cause || error?.meta?.target?.join(',') || 'Unknown DB error',
        {
          extensions: {
            code: 'SYSTEM_ERROR',
            http: { status: 500 },
          },
        }
      );
    },
    req,
  };
};
