const Joi = require('joi');
const mongoose = require('mongoose');
const { subjectSchema } = require('./subject');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    subject: { 
      type: subjectSchema,  
      required: true
    },
    numberInStock: { 
      type: Number, 
      required: true,
      min: 0,
      max: 255
    },
    dailyRentalRate: { 
      type: Number, 
      required: true,
      min: 0,
      max: 255
    }
}));

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        subjectId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(course, schema);
};

exports.Course = Course;
exports.validate = validateCourse;