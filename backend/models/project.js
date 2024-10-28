module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      projectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      budget: DataTypes.DECIMAL,
      status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started',
      },
    });
  
    return Project;
  };
  