import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'tactico-portal',
    clientEmail: 'firebase-adminsdk-id5g3@tactico-portal.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCU31HMp9gL2sJF\nBHFojBIAHKX9eVH4qBJbfh0hTjlS8TJyILNg3tnR5yXUeKcHzPbk4kMRNf/slQIV\nKShFCTKB4tU0JV4i5Y1ZeJcjdinPjmTDqb+tRFlaV2LC1WIGfVhAEQBIwAoxU6xV\nYxFB8DVOfQwa/pXG3v9aLJt/KrFI+g5CIxixUyWG/fhz/vkL42UPkBQVE/H80d9d\n812nXIVPGXNT9utbJCIwTji4dEzRrtWRDklAYUDMvQZF/+RLV55ROzBQhNHGR73u\n/C3TVWmA3Uj2qGgZha7795t+N050DZKXuq6qwgiiPwQV1q+sPV5e4u2dyHyZrZey\nmU3hwq+lAgMBAAECggEAApBVJDrsChMU4YyvieBQO1T51EN2ZNuos49hzXlkCg0i\nCw5nirfAWZCP3iZeEFDT0s/8JrLMlnAWygWA7mSTFZmx844E56XyP99r2ldGQXzh\nphQgO0ngHg9j6s8zOwqqksPhVN9oEhodJnMD0LZkGA26iSQw1bYDAMZ7daMd8OtF\nEjqNdgARScAerVXB8pDDcSGQDRdIp1zFeLfgR4db1uLNSCJTfV3unAQkvYa7oSIE\nJzC3IZnMNd/lI78J1AfaFrCBoB27h87I1ggqsJ6aRP2okvOgfx7CcQmgtz+Z+OUy\nSjOJMI89yFMIcVBmo0jtiH9UO3UD8u1SG1Q/kQfViwKBgQDMfeafGgvRTFWwPjOq\nKcKTdJhYw+XzS1arLIJ5sznFn5HmBoHxeDVIcy1i/apiWzPoURlzDrF6r+h1Mvmv\njGjwzLmvHEcNnvZyBVDKdSZ8hXaaVCTSXBGCGUzG84Cqse3lRGG6NyF74mAFUy5r\nrgMkkyd7dg/5qjZ7vIZbt1GeFwKBgQC6XvLgih3WG/n0P3s1Z/QRi1DlV2PPNLbY\nzYMiRSDNVi21fy/yIXjs1f0iJWJvFhzs8Zp04YV/lK5s1PbpP1IgxAbR/UkbPmXn\nlgljONIyf2k+VVlobuZAmZ18zm23GoeNMFOyqwkmcDOWZH9JZQb9QGXqKN0NDNN3\nYn61q8CRowKBgQCzR7oWSO6Na6BAaPhAumX1gyZBxFXpDGcKoXYunlwLD9AI3DG2\ncw4724ayH/TuUElc5yUpw3sENg7WGX/gUXh7jPFKPb9piLFF27UuGrFIQHZv7U9v\nAfrzlZzDXB61CFOqSl5ntQftJdXLNVcgXqowubbGvgZZe8pSh0FATaMHtwKBgQCw\nGiPZc+i5dfn7hzh+wFlpcoDgFHFlS2Qy/A4bBcL3A6VxSFsfqe0/rPvhlf2rBfQT\nGEBgjPC+GtmuUJV21LRf7ZqcNX8s1QsphyYbsYc83BOwKKmw+olrJTwgwFX/nHvV\nN4L+4opk3cSBKTj1Oxcdmgoy9qXZPPNcbZ9ZPo9ZjQKBgCqpHWLGiBNOfa+DwUkR\nc1t29NJwUD/Uo23cly8+zgZQTxVj+lBWNv7bSUj4haDOrMkPbYWffDujh4EGcxNN\ne92fOp2R2r0BJei9jNk/kVKYwLFUwCddohPmb451o4JxKO4oRxeuUZ9a1/4MED32\neCr2F9Ta7X5QogozmaRDJHXQ\n-----END PRIVATE KEY-----\n',
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
