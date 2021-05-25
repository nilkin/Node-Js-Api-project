const {Course,validate} = require('../models/course');
const express = require('express');
const { Subject } = require('../models/subject');
const router = express.Router();
// const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);

router.get('/', async (req, res) => {
    const courses = await Course.find().sort('name');
    res.send(courses)
});
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(400).send('Invalid subject.')

    let course = new Course({ 
        name: req.body.name ,
        subject:{
            _id:subject._id,
            name:subject.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    course = await course.save();
    res.send(course)
});
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = await Course.findByIdAndUpdate(req.params.id, 
        { name: req.body.name },
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



module.exports = router;