const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
// mongoose.set('useFindAndModify', false);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        type: String,
        required: true,

    }
}));

router.get('/', async (req, res) => {
    const courses = await Course.find().sort('name');
    res.send(courses)
});

router.post('/', async (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    let course = new Course({ name: req.body.name });
    course = await course.save();
    res.send(course)
});
router.put('/:id', async (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = await Course.findByIdAndUpdate(req.params.id, { name: req.body.name },
        { new: true })

    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    res.send(course)
});
router.delete('/:id', async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    res.send(course);
});
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send(`The course with the given ID was not found.`);
    res.send(course)
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
};

module.exports = router;