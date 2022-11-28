import { Model } from 'sequelize';

export default (sequelize, DataTypes): any => {
  class User extends Model {
    static associate(models) {
      // Define association
      User.hasMany(models.Course, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['password']
        },
      },
    },
  );
  return User;
};
