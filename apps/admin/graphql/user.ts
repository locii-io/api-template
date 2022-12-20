import { gql } from './__generated__/gql';

export const GET_ALL_USERS = gql(`
  query Users {
    users {
      id
      name
      email
      isActive
    }
  }
`);

export const GET_USER_BY_ID = gql(`
  query GetUserByID($userById: Int!) {
    userById(id: $userById) {
      email
      id
      isActive
      name
    }
  }
`);
