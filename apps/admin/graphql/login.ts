import { gql } from './__generated__';

export const LOGIN_WITH_TOKEN = gql(`
mutation loginWithToken($provider: String!, $token: String!) {
  loginWithToken(provider: $provider, token: $token) {
    userId
    token
  }
}`);
