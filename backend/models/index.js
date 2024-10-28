const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Project = require('./project')(sequelize, Sequelize);
db.Task = require('./task')(sequelize, Sequelize);

db.User.hasMany(db.Project, { foreignKey: 'ownerId' });
db.Project.belongsTo(db.User, { foreignKey: 'ownerId' });

db.Project.hasMany(db.Task, { foreignKey: 'projectId' });
db.Task.belongsTo(db.Project, { foreignKey: 'projectId' });

db.User.hasMany(db.Task, { foreignKey: 'assignedTo' });
db.Task.belongsTo(db.User, { foreignKey: 'assignedTo' });

module.exports = db;
