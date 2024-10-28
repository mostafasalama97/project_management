require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Database Configuration
const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1); 
  });

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);


app.get('/test', (req, res) => res.send('Server and database are connected!'));


// // Sync Database and Start Server only if not in test mode
// // if (process.env.NODE_ENV !== 'test') {
// //     const PORT = process.env.PORT || 8080;
// //     db.sequelize.sync({ force: false }).then(() => {
// //       app.listen(PORT, () => {
// //         console.log(`Server is running on port ${PORT}`);
// //       });
// //     });
// //   }
  
// //   module.exports = app;