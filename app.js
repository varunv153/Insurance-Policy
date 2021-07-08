//importing modules
const express = require('express');
var app=express();
const routes = require('./Router/routes.js');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./openapi.json');

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//app settings
port = process.env.PORT || 3000;

app.use(routes);

app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
})