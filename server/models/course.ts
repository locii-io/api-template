
import { Model } from 'sequelize';
export default (sequelize, DataTypes): any => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here         
      Course.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Course.init({
    userId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    points: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};