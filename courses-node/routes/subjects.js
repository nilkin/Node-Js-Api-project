const { Subject, validate } = require('../models/subject');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
    const subjects = await Subject.find().sort('name');
    res.send(subjects)
});
router.post('/',auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    const subject = new Subject({
        name: req.body.name,
    });
    await subject.save();
    res.send(subject)
});
router.put('/:id', auth,async (req, res) => {
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
router.delete('/:id',[auth,admin], async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).send(`The subject with the given ID was not found.`);
    res.send(subject);
});
router.get('/:id',auth, async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send(`The subject with the given ID was not found.`);
    res.send(subject)
});


module.exports = router;