require('dotenv').config();
import { resolvers, authProviders } from '../src/resolvers/login';
import { configStych } from '../src/lib/stytch';
describe('Login End Points (unit)', () => {
  test('(+) Login Test', async () => {
    try {
      await resolvers.Mutation.loginWithToken(
        null,
        { provider: 'STYTCH_OAUTH', token: 'TOKEN' },
        { models: null }
      );
      expect(null).toBe('Should not reach here');
    } catch (error) {
      expect(error.message).toBe('Provider invalid');
    }

    configStych(authProviders);
    /*
    try {
      await resolvers.Mutation.loginWithToken(
        null,
        { provider: 'STYTCH_OAUTH', token: 'TOKEN' },
        { models: null }
      );
      expect(null).toBe('Should not reach here');
    } catch (error) {
      expect(error.message).toBe('Authentication Token Invalid');
    }
    */
    const response = await resolvers.Mutation.loginWithToken(
      null,
      { provider: 'STYTCH_OAUTH', token: 'xHrElqywubD4bfJOQkbUu5UFFSh997goGIy2ZWGcGl3T' },
      { models: null }
    );
    expect(response).toBe('Authentication Token Invalid');
  });
});
