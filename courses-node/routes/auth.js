const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPswrd = await bcrypt.compare(req.body.password, user.password);
    if (!validPswrd) return res.status(400).send("Invalid email or password.");

    const token = jwt.sign({ _id: user._id }, "jwtSecretKey")
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(7).max(255).required().email(),
        password: Joi.string().min(7).max(1024).required()

    };

    return Joi.validate(req, schema);
}

module.exports = router;