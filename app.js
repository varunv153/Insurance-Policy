//importing modules
var express = require('express');
var bodyParser =require('body-parser');
const { Sequelize } = require('sequelize');

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
async function check_database_working()
{
	try
	{
		await sequelize.authenticate();
		console.log('Database connection has been established successfully.');
	} 
	catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

//routes
app.post('/signup',(req,res)=>{
	res.send(req.body);
})
app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
	check_database_working();
})