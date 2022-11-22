import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
const basename = path.basename(__filename);

export const resolvers = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename && /\.(j|t)s$/.test(file) && !/\.d\.(j|t)s$/.test(file),
  )
  .forEach((file) =>
    merge(resolvers, require(path.join(__dirname, file)).resolvers),
  );
