//importing modules
const express = require('express');
const routes = require('./Router/routes.js');

//app settings
var app=express();
port = process.env.PORT || 3000;

app.use(routes);

app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
})