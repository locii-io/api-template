import { Model } from 'sequelize';

export default (sequelize, DataTypes): any => {
  class Course extends Model {
    static associate(models) {
      // Define association
      Course.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Course.init(
    {
      userId: DataTypes.NUMBER,
      name: DataTypes.STRING,
      points: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: 'Course',
    },
  );
  return Course;
};
