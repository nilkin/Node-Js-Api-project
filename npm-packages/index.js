'use strict';
const config = require('config');
const uuid = require('uuid');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.use(helmet());

console.log('App name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Password of mail: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enaibled...');
};

const courses = [
    { id: uuid.v4(), name: "courses1" },
    { id: uuid.v4(), name: "courses2" },
    { id: uuid.v4(), name: "courses3" },
];
app.get('/', (req, res) => {
    res.send('<H1>Hello World!!!</H1>')
});
app.get('/api/courses', (req, res) => {
    res.send(courses)
});
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    const course = {
        id: uuid.v4(),
        name: req.body.name
    };
    courses.push(course);
    res.send(course)
});
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    course.name = req.body.name
    res.send(course)
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    res.send(course);
});
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    const index = courses.indexOf(course);
    courses.splice(index, 1)
    res.send(course)
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}.....`))