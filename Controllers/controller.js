const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../Database/Models/models.js');

var app = express();

//add a row to the user table when sign up
async function save_row(req,res,next)
{
	try
	{
		req.body.salt = await bcrypt.genSalt();
		req.body.password = await bcrypt.hash(req.body.password, req.body.salt);
		await models.User.create(req.body);
		console.log('User was saved to the database!');
	}
	catch(err){
		console.log("err");
	}
	next();
};
async function login_post(req,res)
{
	var valid_user = await models.User.findByPk(req.body.email);
	if (valid_user) {
		const auth = await bcrypt.compare(req.body.password, valid_user.password);
		if (auth) {
			res.redirect('/restricted');
		}
		res.send('incorrect password');
	}
	else{
		res.send("This user does not exist");
	}
};
module.exports = {save_row, login_post};

