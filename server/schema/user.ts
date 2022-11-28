export const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
    password: String
    isActive: Boolean
    courses: [Course]!
  }

  extend type Query {
    users: [User]!
    userById(id: Int!): User    
  }

  extend type Mutation {
    createUser(name: String!,
      email: String!,
      password: String!,
      isActive: Boolean): User!
    updateUser(id: Int!, 
      name: String, 
      email: String, 
      password: String,
      isActive: Boolean): User!
    deleteUser(id: Int!): User!  
  }  
`;
