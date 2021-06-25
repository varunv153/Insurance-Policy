const express = require('express');
const bodyParser =require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

module.exports = app;