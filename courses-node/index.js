'use strict';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const debug = require('debug')('app:startup');
const config = require('config');
const courses = require('./routes/courses');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const subjects = require('./routes/subjects');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const helmet = require('helmet');

mongoose.connect('mongodb://localhost/courses', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDb....'))
    .catch(err => console.error('Could not connect to MongoDb....,', err.message));

app.set('view engine', 'pug');
app.set('views', './views'); // by default
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/api/customers', customers);
app.use('/api/subjects', subjects);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/rentals', rentals);
app.use('/', home);
app.use(logger);

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}
console.log('App name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Password of mail: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enaibled...');
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port http://localhost:${port}`))