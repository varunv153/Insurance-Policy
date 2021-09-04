const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../Database/Models/models.js');
var passwordValidator = require('password-validator');
const { Op } = require("sequelize");

const secret_user = "varun user secret key";
const secret_company = "varun db user secret key";

//add a row to the user table when sign up
async function signup(req,res,db)
{
	try
	{
		if(!req.body.password)
			throw('Password Required!');

		//defining password schema
		var pwd_schema = new passwordValidator();
		pwd_schema
		.is().min(8)                                    // Minimum length 8
		.is().max(100)                                  // Maximum length 100
		.has().uppercase()                              // Must have uppercase letters
		.has().lowercase()                              // Must have lowercase letters
		.has().digits(2)                                // Must have at least 2 digits
		.has().not().spaces()                           // Should not have spaces
		.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
		//finish defining password schema

		if(!pwd_schema.validate(req.body.password))
			throw( pwd_schema.validate(req.body.password, { list: true } ) );

		req.body.salt = await bcrypt.genSalt();
		req.body.password = await bcrypt.hash(req.body.password, req.body.salt);

		await db.create(req.body);
		console.log(db,'was saved to the database!');

		res.json({signup_status:'success'});
	}
	catch(err){
		res.status(400).json({"signup_status" : err});
	}
}
async function login(req,res,db,secret)
{
	var valid_user = await db.findByPk(req.body.email);
	if (valid_user) {
		const auth = await bcrypt.compare(req.body.password, valid_user.password);
		if (auth) {
			const jwt_token =jwt.sign(req.body.email, secret);
			res.cookie('jwt', jwt_token);
			res.json({"login_status": "You are logged in"});
		}
		else{
			res.status(401).json({"login_status":'incorrect password'});
		}
	}
	else{
		res.status(404).json({"login_status":"Does not exist"});
	}
};
async function authorise(req,res,db,secret,next)
{
	if (req.cookies.jwt)
	{
		jwt.verify(req.cookies.jwt, secret, (err, decodedToken) => {
			if (err) {
				res.status(401).json({"Error": 'Not Authorised'});
			}
			else {
				next();
			}
		});
	}
	else {
		res.status(401).json({"Error" : 'Not Authorised'});
	}
};


async function signup_user(req,res)
{
	console.log("got request for signup user")
	signup(req,res,models.user);
};
async function signup_company(req,res)
{
	signup(req,res,models.company);
};

async function login_user(req,res)
{
	login(req,res,models.user,secret_user);
};
async function login_company(req,res)
{
	login(req,res,models.company,secret_company);
};
async function authorise_user(req,res,next)
{
	authorise(req,res,models.user,secret_user,next);
};
async function authorise_company(req,res,next)
{
	authorise(req,res,models.company,secret_company,next);
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
		req.body.company_adminemail = await jwt.decode(req.cookies.jwt);
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
		const policy_req = await models.policy.findByPk(req.body.policyid);
		req.body.useremail = await jwt.decode(req.cookies.jwt);
		req.body.premium = policy_req.suminsured*req.body.policyholderage*req.body.policyage/1000;
		await models.purchasedpolicy.create(req.body);
		res.json({"Purchase_Status":'Policy bought!'});
	}
	catch(err){
		res.status(400).json({'Error' : err});
	}
};
async function view_my_policies(req,res)
{
	const result = await
	models.purchasedpolicy.findAll({
		where :{
			useremail : await jwt.decode(req.cookies.jwt)
		}
	});
	res.json( result );
};
async function claim_my_policy(req,res)
{
	try
	{
		req.body.claimstatus = "unapproved";
		const bond = await models.purchasedpolicy.findByPk(req.body.bondid);
		if(!bond)
			res.status(404).json({"Status":"Bond doesn't exist"});
		if(bond.useremail != await jwt.decode(req.cookies.jwt))
			res.status(401).json({"Status":"This bond doesn't belong to you"});
		await models.claim.create(req.body);
		res.json({"Status":"claim created"});
	}
	catch(err){
		res.json({"Error":err});
	}
};
async function viewmyclaims(req,res)
{
	try
	{
		const mybonds= await
		models.purchasedpolicy.findAll({
			where :{
				useremail : await jwt.decode(req.cookies.jwt)
			}
		});

		const mybondsid =[];
		for (let i = 0; i < mybonds.length; i++)
			mybondsid[i] = mybonds[i].id;

		const result = await 
		models.claim.findAll({
			where :
			{
				bondid : 
				{
					[Op.in]:mybondsid
				}
			}
		});
		res.json(result);
	}
	catch(err)
	{
		res.json({"Error":err});
	}
};
async function view_policies_of_my_company(req,res)
{
	const mypolicies= await
	models.policy.findAll({
		where :{
			company_adminemail : await jwt.decode(req.cookies.jwt)
		}
	});
	res.json(mypolicies);
}
async function view_bonds_of_my_company(req,res)
{
	const mypolicies= await
	models.policy.findAll({
		where :{
			company_adminemail : await jwt.decode(req.cookies.jwt)
		}
	});
	const mypolicyid =[];
	for (let i = 0; i < mypolicies.length; i++)
		mypolicyid[i] = mypolicies[i].id;

	const mybonds= await
	models.purchasedpolicy.findAll({
		where :
		{
			policyid : 
			{
				[Op.in]:mypolicyid
			}
		}
	});
	res.json(mybonds)
}
async function view_claims_of_my_company(req,res)
{
	try
	{
		const mypolicies= await
		models.policy.findAll({
			where :{
				company_adminemail : await jwt.decode(req.cookies.jwt)
			}
		});
		const mypolicyid =[];
		for (let i = 0; i < mypolicies.length; i++)
			mypolicyid[i] = mypolicies[i].id;
		console.log(mypolicyid);

		const mybonds= await
		models.purchasedpolicy.findAll({
			where :
			{
				policyid : 
				{
					[Op.in]:mypolicyid
				}
			}
		});
		//res.json(mybonds);
		const mybondsid =[];
		for (let i = 0; i < mybonds.length; i++)
			mybondsid[i] = mybonds[i].id;

		const result = await 
		models.claim.findAll({
			where :
			{
				bondid : 
				{
					[Op.in]:mybondsid
				}
			}
		});
		res.json(result);
	}
	catch(err)
	{
		console.log(err);
		res.send(err);
	}
}
function page_404(req,res)
{
	res.status(404).json({ error: 'Enter a valid URL' });
};


module.exports = {signup_user, signup_company,
				login_user,login_company,
				authorise_user, authorise_company,
				logout, createpolicy, viewpolicies, buypolicy, view_my_policies, claim_my_policy,viewmyclaims, 
				view_policies_of_my_company, view_bonds_of_my_company, view_claims_of_my_company, page_404};