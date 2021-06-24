//importing modules
const express = require('express');
const bodyParser =require('body-parser');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const cookieParser =require('cookie-parser');



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
//add a row to the user table
async function save_row(req,res,next)
{
	try
	{
		req.body.salt = await bcrypt.genSalt();
		req.body.password = await bcrypt.hash(req.body.password, req.body.salt);
		await User.create(req.body);
		console.log('User was saved to the database!');
	}
	catch(err){
		console.log("err");
	}
	next();
};


//routes
app.post('/signup',save_row,(req,res)=>{
	res.send(req.body);
})
app.get('/restricted',(req,res)=>{
	res.send("welcome to the restricted zone");
})
app.post('/login',async (req,res)=>{
	var valid_user = await User.findByPk(req.body.email);
	if (valid_user != null) {
		const auth = await bcrypt.compare(req.body.password, valid_user.password);
		if (auth) {
			res.redirect('.restricted');
		}
		res.send('incorrect password');
	}
	else{
		res.send("This user does not exist");
	}
});
app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
})