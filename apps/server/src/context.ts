import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { stytchProviders } from './lib/stytch';
import { firebaseProviders } from './lib/firebase';

const prisma = new PrismaClient();

export interface Context {
  models: PrismaClient;
  handleModelError: () => void;
}

export const context = async ({ req }) => {
  return {
    authProviders: {
      ...stytchProviders,
      ...firebaseProviders,
    },
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
