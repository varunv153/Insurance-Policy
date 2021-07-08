//importing modules
const express = require('express');
var app=express();
const routes = require('./Router/routes.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: 'Policy Websitaae API',
			description: "Informations of APIs related to the website",
			contacts: {
				name: "Varun Venkatesh"
			}
		}
	},
	apis: ["./Router/routes.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//app settings
port = process.env.PORT || 3000;

app.use(routes);

app.listen(port,(req,res)=>{
	console.log("Listening on port:",port);
})