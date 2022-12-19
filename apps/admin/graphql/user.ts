import { gql } from './__generated__/gql';

export const UsersQuery = gql(`
  query Users {
    users {
      id
      name
      email
      isActive
    }
  }
`);

export const GetUserByID = gql(/* GraphQL */ `
  query Query($userById: Int!) {
    userById(id: $userById) {
      email
      id
      isActive
      name
    }
  }
`);
