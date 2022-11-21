export const typeDefs = `
 type Token String!

  extend type Mutation {
    login(email: String!, password: String!): Token!
  }
`;