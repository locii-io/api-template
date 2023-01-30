import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

export const firebaseProviders = {
  FIREBASE: {
    validate: async (token) => {
      try {
        const response = await getAuth().verifyIdToken(token);
        console.log(JSON.stringify(response));
        return {
          oath_provider: response.provider_type,
          provider: 'FIREBASE',
          id: response.user_id,
          user: response.user,
          email: response.user?.emails?.find((e) => e)?.email,
        };
      } catch (error) {
        return null;
      }
    },
  },
};
