export const typeDefs = `
  type LoginResponse {
    userId: String!
    token: String!    
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginResponse!
    loginWithToken(provider: String!, token: String!): LoginResponse!
  }
`;
