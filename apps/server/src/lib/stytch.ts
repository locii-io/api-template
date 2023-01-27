import * as stytch from 'stytch';

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET,
  env: stytch.envs.test,
});

export const configStych = (authProviders) => {
  authProviders['STYTCH_OAUTH'] = {
    validate: async (token) => {
      try {
        const response = await client.oauth.authenticate(token, {
          session_duration_minutes: 60 * 24,
        });
        return response;
      } catch (error) {
        return null;
      }
    },
  };
};
