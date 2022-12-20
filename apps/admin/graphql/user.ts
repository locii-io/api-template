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

export const CREATE_USER = gql(`
mutation CreateUser($name: String!, $email: String!, $password: String!) {
  createUser(name: $name, email: $email, password: $password) {
    id
    name
    email
    isActive
  }
}`);
