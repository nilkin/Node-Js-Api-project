'use strict';
const express = require('express');
const app = express();
const debug = require('debug')('app:startup');
const config = require('config');
const courses = require('./routes/courses');
const home = require('./routes/home');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const helmet = require('helmet');

app.set('view engine', 'pug');
app.set('views', './views'); // by default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);
app.use(logger);

console.log('App name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Password of mail: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enaibled...');
};




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}.....`))