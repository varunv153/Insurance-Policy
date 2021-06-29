const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../Database/Models/models.js');

//add a row to the user table when sign up
async function signup_user(req,res)
{
	try
	{
		req.body.salt = await bcrypt.genSalt();
		if(!req.body.password)
			throw('Password Required!');
		const min_pass_length = 8;
		if(req.body.password.length<min_pass_length)
			throw( {"Password length should be a minimum" : min_pass_length } );
		req.body.password = await bcrypt.hash(req.body.password, req.body.salt);

		await models.user.create(req.body);
		console.log('User was saved to the database!');

		await models.company.create({company_gstin:req.body.email, password:req.body.password,salt:req.body.salt,company_name:req.body.name});
		console.log('Company was saved to the database!');

		res.json({signup_status:'success'});
	}
	catch(err){
		res.status(400).json({"Error" : err});
	}
};
async function login_post(req,res)
{
	var valid_user = await models.user.findByPk(req.body.email);
	if (valid_user) {
		const auth = await bcrypt.compare(req.body.password, valid_user.password);
		if (auth) {
			const jwt_token =jwt.sign(req.body.email, 'varun secret jwt key');
			res.cookie('jwt', jwt_token);
			res.json({"login_status": "You are logged in"});
		}
		else{
			res.status(401).json({"login_status":'incorrect password'});
		}
	}
	else{
		res.status(404).json({"login_status":"This user does not exist"});
	}
};
async function authorise(req,res,next)
{
	if (req.cookies.jwt)
	{
		jwt.verify(req.cookies.jwt, 'varun secret jwt key', (err, decodedToken) => {
			if (err) {
				res.status(401).json({"Error": 'Not Authorised, please login'});
			}
			else {
				next();
			}
		});
	}
	else {
		res.status(401).json({"Error" : 'Not Authorised, please login'});
	}
};
async function logout(req,res)
{
	res.cookie('jwt', '', { maxAge: 1 });
	res.json({"login_status" : 'Logged out'});
};

async function createpolicy(req,res)
{
	try
	{
		req.body.company_gstin = await jwt.decode(req.cookies.jwt);
		await models.policy.create(req.body);
		res.json({"Policy_Status" : 'Policy was saved to the database!'});
	}
	catch(err){
		res.status(400).json({'Error' : err});
	}
};
async function viewpolicies(req,res)
{
	res.json( await models.policy.findAll() );
};
async function buypolicy(req,res)
{
	try
	{
		req.body.useremail = await jwt.decode(req.cookies.jwt);
		req.body.premium = req.body.policyholderage*1000*req.body.policyage;
		await models.purchasedpolicy.create(req.body);
		res.json({"Purchase_Status":'Policy bought!'});
	}
	catch(err){
		res.status(400).json({'Error' : err});
	}
};
function page_404(req,res)
{
	res.status(404).json({ error: 'Enter a valid URL' });
};


module.exports = {signup_user, login_post,authorise, logout, createpolicy, viewpolicies, buypolicy, page_404};