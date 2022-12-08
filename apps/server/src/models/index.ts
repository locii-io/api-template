const Sequelize = require('sequelize');
import fs from 'fs';
const path = require('path');
const basename = path.basename(__filename);

const db: any = {};

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename && /\.(j|t)s$/.test(file) && file.slice(-5) !== '.d.ts',
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync({ force: true })
  .then()
  .catch((err) => console.error(err));

export default db;
