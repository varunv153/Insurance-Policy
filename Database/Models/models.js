const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db_connection.js');


const email_column = { type: DataTypes.STRING, primaryKey: true, validate: {isEmail: true} };
const password_column = {type: DataTypes.STRING, allowNull: false, validate: {len: [8,255]} };
const salt_column = {type: DataTypes.STRING(1000), allowNull: false};
const name_column = { type: DataTypes.STRING, allowNull: false, validate: {is: /^([a-z]| |[A-Z])*$/} };
const PhoneNo_column = {type: DataTypes.STRING, allowNull: false, validate: {isNumeric: true, len: [10,10], min:0}};
const id_column = { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true };
const text_column = {type: DataTypes.TEXT, allowNull: false};
const money_column = { type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} };


//creating user model
const user = sequelize.define('user', {
  email : { type: DataTypes.STRING, primaryKey: true, validate: {isEmail: true} },
  password : { type: DataTypes.STRING, allowNull: false, validate: {len: [8,255]} },
  salt : { type: DataTypes.STRING(1000), allowNull: false},
  name : { type: DataTypes.STRING, allowNull: false, validate: {is: /^([a-z]| |[A-Z])*$/} },
  phoneno : {type: DataTypes.STRING, allowNull: false, validate: {isNumeric: true, len: [10,10], min:0}}
}, {
  timestamps: false
});

//company company model
const company = sequelize.define('company', {
  company_gstin : { type: DataTypes.STRING, primaryKey: true, validate: {isEmail: true} },
  company_name : { type: DataTypes.STRING, allowNull: false, validate: {is: /^([a-z]| |[A-Z])*$/} },
  password : { type: DataTypes.STRING, allowNull: false, validate: {len: [8,255]} },
  salt: { type: DataTypes.STRING(1000), allowNull: false}
}, {
  timestamps: false
});

//creating policy model
const policy = sequelize.define('policy', {
  id : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  policywording : {type: DataTypes.TEXT, allowNull: false},
  roomrentcap :{ type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} },
  suminsured :{ type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} },
  company_gstin : { type: DataTypes.STRING, validate: {isEmail: true}, references: {model: company ,key: 'company_gstin'}},
  exemptions : {type: DataTypes.TEXT, allowNull: false},
  claim_settlement_ratio:{
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {isNumeric: true, isFloat: true, min:0}
  }
}, {
  timestamps: false
});

//purchased policies model
const purchasedpolicy = sequelize.define('purchasedpolicy', {
  id : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  useremail : { type: DataTypes.STRING, validate: {isEmail: true}, references: {model: user ,key: 'email'} },
  policyid : {type: DataTypes.INTEGER,allowNull: false,references: {model: policy,key: 'id'}},
  policyholdername : { type: DataTypes.STRING, allowNull: false, validate: {is: /^([a-z]| |[A-Z])*$/} },
  policyholderage : { type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} },
  policyage : { type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} },
  preexistingdiseases : {type: DataTypes.TEXT, allowNull: false},
  premium :{ type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} }  
}, {
  timestamps: true,
  updatedAt: false,
  createdAt: 'policypurchasedate'
});



//check if database is synced
(async()=>
{
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
})();

module.exports = {user, company, policy, purchasedpolicy};