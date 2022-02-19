const express = require('express');
const path = require('path');
const app = express();
var mongoose = require('mongoose');
var dotenv = require('dotenv')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();
app.use(cors('*'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT;
const Portfolio = require('./routes/portfolio')
const Ocatagon = require('./routes/octagon')


app.use(express.static('images'));
app.use('/api/portfolio', Portfolio);
app.use('/api/ocatagon-dynamics', Ocatagon);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})
app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`));