require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const port = process.env.PORT || 3001;

// MIDDLEWARES
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// TEST DATABASE CONNECTION
const knex = require('./knex/knex.js');

knex.raw('SELECT 1')
    .then(() => {
        console.log('DATABASE CONNECTED');
    })
    .catch((e) => {
        console.log('DATABASE NOT CONNECTED');
        console.error(e);
    });

// ROUTES
app.use(require('./routes'));

// DEFAULT ROUTE
app.use(function (req, res) {
    return res.status(404).json({
        message: 'Route not found :)',
    });
});

// CRON JOBS
let cronJob = require('./cron/index');

// SERVER
app.listen(port, () => {
    console.log(`Server is up and  running on port ${port}`);
});
