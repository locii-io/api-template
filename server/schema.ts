import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    isActive: Boolean!
    courses: [Course!]!
  }

  type Course {
    id: Int!
    name: String!
    points: Int!
    user: User!
  }

  type Query {
    users: [User!]!
    userById(id: Int!): User
    courses: [Course!]!
    courseById(id: Int!): Course
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
    deleteUser(id: Int!): String
    login(email: String!, password: String!): String

    createCourse(userId: Int!, name: String!, points: Int!): Course!
    updateCourse(id: Int!, name: String, points: Int): Course!
    deleteCourse(id: Int!): String
  }
`;
