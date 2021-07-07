const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db_connection.js');


function email_pk_column(){ return{ type: DataTypes.STRING, primaryKey: true, validate: {isEmail: true} }};
function email_column(){ return{ type: DataTypes.STRING, validate: {isEmail: true} }};
function password_column(){ return{type: DataTypes.STRING, allowNull: false, validate: {len: [8,255]} }};
function salt_column(){ return{type: DataTypes.STRING(1000), allowNull: false}};
function name_column(){ return{ type: DataTypes.STRING, allowNull: false, validate: {is: /^([a-z]| |[A-Z])*$/} }};
function PhoneNo_column(){ return{type: DataTypes.STRING, allowNull: false, validate: {isNumeric: true, len: [10,10], min:0}}};
function id_pk_column(){ return{ type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }};
function id_column(){ return{ type: DataTypes.INTEGER}};
function text_column(){ return{type: DataTypes.TEXT, allowNull: false}};
function money_column(){ return{ type: DataTypes.INTEGER, allowNull: false, validate: {isNumeric: true, min:1} }};


//creating user model
const user = sequelize.define('user', {
  email : email_pk_column(),
  password : password_column(),
  salt : salt_column(),
  name : name_column(),
  phoneno : PhoneNo_column()
}, {
  timestamps: false
});

//company company model
const company = sequelize.define('company', {
  company_adminemail : email_pk_column(),
  company_name : name_column(),
  password : password_column(),
  salt: salt_column()
}, {
  timestamps: false
});

//creating policy model
const policy = sequelize.define('policy', {
  id : id_pk_column(),
  policywording : text_column(),
  roomrentcap :money_column(),
  suminsured :money_column(),
  company_adminemail : Object.assign({},email_column(),{references: {model: company ,key: 'company_adminemail'}}),
  exemptions : text_column(),
  claim_settlement_ratio : {type: DataTypes.DOUBLE,allowNull: false,validate: {isNumeric: true, isFloat: true, min:0, max:100}}
}, {
  timestamps: false
});

//purchased policies model
const purchasedpolicy = sequelize.define('purchasedpolicy', {
  id : id_pk_column(),
  useremail : Object.assign({},email_column(),{references: {model: user ,key: 'email'}}),
  policyid : Object.assign({},id_column(),{references: {model: policy ,key: 'id'}}),
  policyholdername : name_column(),
  policyholderage : money_column(),
  policyage : money_column(),
  preexistingdiseases : text_column(),
  premium :money_column()  
}, {
  timestamps: true,
  updatedAt: false,
  createdAt: 'policypurchasedate'
});

const claim = sequelize.define('claim', {
  id : id_pk_column(),
  bondid : Object.assign({},id_column(),{references: {model: purchasedpolicy ,key: 'id'}}),
  reason : text_column(),
  claim_amount : money_column(),
  hospital_name : name_column(),
  city : name_column(),
  claimstatus : { type: DataTypes.STRING, allowNull: false, defaultValue: "unapproved", validate: {is: /^(approved|unapproved)$/}}
},{
  timestamps: false
});



//check if database is synced
(async()=>
{
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
})();

module.exports = {user, company, policy, purchasedpolicy, claim};