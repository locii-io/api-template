export const typeDefs = `
 type Course {
    id: Int!    
    name: String!
    points: Int!    
    user: User!
  }

  extend type Query {
    courses: [Course!]!
    courseById(id: Int!): Course  
  }

  extend type Mutation {
    createCourse(userId: Int!, name: String!, points: Int!): Course!
    updateCourse(id: Int!, name: String, points: Int): Course!
    deleteCourse(id: Int!): String
  }  
`