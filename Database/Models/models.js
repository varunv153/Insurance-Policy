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
  },
  Name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  PhoneNo:{
    type: DataTypes.INTEGER(10),
    allowNull: false
  },
}, {
  timestamps: false
});

//company user model
const Company = sequelize.define('Company', {
  CompanyGSTIN: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salt:{
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  CompanyName:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

//creating policy model
const Policy = sequelize.define('Policy', {
  PolicyID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,    
  },
  PolicyWording: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  RoomRentCap:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  SumInsured:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CompanyGSTIN:{
    type: DataTypes.STRING,
    allowNull: false,
    references: {model: Company ,key: 'CompanyGSTIN'}
  },
  Exemptions:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  ClaimSettlementRatio:{
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  timestamps: false
});

//purchased policies model
const PurchasedPolicy = sequelize.define('PurchasedPolicy', {
  BondID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true    
  },
  UserEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {model: User,key: 'email'}
  },
  PolicyID:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {model: Policy,key: 'PolicyID'}
  },
  PolicyHolderName:{
    type: DataTypes.STRING,
    allowNull: false
  },
  PolicyHolderDOB:{
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  PreExistingDiseases:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  Premium:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: false,
  createdAt: 'PolicyPurchaseDate'
});



//check if database is synced
(async()=>
{
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
})();

module.exports = {User};