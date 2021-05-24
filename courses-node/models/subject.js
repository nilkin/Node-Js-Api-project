const Joi = require('joi');
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

function validateSubject(subject) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(subject, schema);
}

exports.subjectSchema = subjectSchema;
exports.Subject = Subject; 
exports.validate = validateSubject;