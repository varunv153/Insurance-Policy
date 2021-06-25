const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../Database/Models/models.js');

var app = express();

//add a row to the user table when sign up
async function signup_user(req,res,next)
{
	try
	{
		req.body.salt = await bcrypt.genSalt();
		req.body.password = await bcrypt.hash(req.body.password, req.body.salt);
		await models.User.create(req.body);
		console.log('User was saved to the database!');
		await models.Company.create({CompanyGSTIN:req.body.email, password:req.body.password,salt:req.body.salt,CompanyName:req.body.Name});
		console.log('Company was saved to the database!');
	}
	catch(err){
		console.log('Error in signing up');
	}
	next();
};
async function login_post(req,res)
{
	var valid_user = await models.User.findByPk(req.body.email);
	if (valid_user) {
		const auth = await bcrypt.compare(req.body.password, valid_user.password);
		if (auth) {
			const jwt_token =jwt.sign(req.body.email, 'varun secret jwt key');
			res.cookie('jwt', jwt_token);
			res.send('You are logged in');
		}
		else{
			res.send('incorrect password');
		}
	}
	else{
		res.send("This user does not exist");
	}
};
async function authorise(req,res,next)
{
	if (req.cookies.jwt)
	{
		jwt.verify(req.cookies.jwt, 'varun secret jwt key', (err, decodedToken) => {
			if (err) {
				res.send('Not Authorised');
			}
			else {
				next();
			}
		});
	}
	else {
		res.send('Not Authorised');
	}
};
async function logout(req,res)
{
	res.cookie('jwt', '', { maxAge: 1 });
	res.send('Logged out');
};

async function createpolicy(req,res)
{
	try
	{
		req.body.CompanyGSTIN = await jwt.decode(req.cookies.jwt);
		await models.Policy.create(req.body);
		res.send('Policy was saved to the database!');
	}
	catch(err){
		console.log('Error in creating policy');
	}
};
async function viewpolicies(req,res)
{
	res.send( await models.Policy.findAll() );
};

module.exports = {signup_user, login_post,authorise, logout, createpolicy, viewpolicies};

