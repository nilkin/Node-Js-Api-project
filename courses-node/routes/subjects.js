const {Subject,validate} = require('../models/subject');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const subjects = await Subject.find().sort('name');
    res.send(subjects)
});
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    let subject = new Subject({
        name: req.body.name,
    });
    subject = await subject.save();
    res.send(subject)
});
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const subject = await Subject.findByIdAndUpdate(
        req.params.id, {
        name: req.body.name,
    },
        { new: true })

    if (!subject) return res.status(404).send(`The subject with the given ID was not found.`);
    res.send(subject)
});
router.delete('/:id', async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).send(`The subject with the given ID was not found.`);
    res.send(subject);
});
router.get('/:id', async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send(`The subject with the given ID was not found.`);
    res.send(subject)
});


module.exports = router;