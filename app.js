//importing modules
var express = require('express');
var bodyParser =require('body-parser');
//var models = require('./models.js')
const { Sequelize, DataTypes } = require('sequelize');




//app settings
var app=express();
port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




//connecting database and then testing
const sequelize = new Sequelize('poly3', 'root', '', {
	host: 'localhost',
	port: '3306',
	dialect: 'mysql'
});
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


//database model user
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,    
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

console.log( (User === sequelize.models.User)?'User model created':'User model not created' ); // true

(async()=>
{
	await User.sync();
	console.log("User database synced");
})();
async function save_row()
{
	const jane = User.build({ email: "Varun", password:"Jana"});
	await jane.save();
	console.log('Jane was saved to the database!');
};


//routes
app.post('/signup',(req,res)=>{
	res.send(req.body);
})
app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
	//check_database_working();
})