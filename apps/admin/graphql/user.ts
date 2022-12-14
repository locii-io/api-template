import { gql } from '@apollo/client';

export const UsersQuery = gql`
  query Users {
    users {
      id
      email
      name
    }
  }
`;
