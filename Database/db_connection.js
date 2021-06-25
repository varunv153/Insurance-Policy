const { Sequelize, DataTypes } = require('sequelize');

//connecting database
const sequelize = new Sequelize('poly3', 'root', '', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql'
});

//testing database connection
(async()=>
{
  try
  {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } 
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;