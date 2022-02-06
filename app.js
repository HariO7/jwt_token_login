require('dotenv').config()

require("./config/database").connect();

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(express.json());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: true}));












module.exports = app;