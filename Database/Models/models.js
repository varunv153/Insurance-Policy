const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db_connection.js');

//creating user model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,    
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salt:{
  	type: DataTypes.STRING(1000),
    allowNull: false
  }
}, {
  timestamps: false
});

//check if database is synced
(async()=>
{
  await User.sync({ force: true });
  console.log("User database synced");
})();

module.exports = {User};