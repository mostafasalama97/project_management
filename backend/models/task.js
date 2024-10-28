module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      taskId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      taskName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium',
      },
      status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started',
      },
    });
  
    return Task;
  };
  