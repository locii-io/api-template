export const typeDefs = `
  type LoginResponse {
    userId: Int!
    token: String!    
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginResponse!
  }
`;