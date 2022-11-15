import fs from 'fs';
import path from 'path';
const basename = path.basename(__filename);

const Query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
export const typeDefs = [Query];

fs
  .readdirSync(__dirname)
  .filter(file => file !== basename && /\.js$/.test(file))
  .forEach(file => typeDefs.push(require(path.join(__dirname, file)).typeDefs));

