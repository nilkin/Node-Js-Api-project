const {Rental, validate} = require('../models/rental'); 
const {Course} = require('../models/course'); 
const {Customer} = require('../models/customer'); 
// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send('Invalid course.');

  if (course.numberInStock === 0) return res.status(400).send('Course not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    course: {
      _id: course._id,
      name: course.name,
      dailyRentalRate: course.dailyRentalRate
    }
  });
  rental = await rental.save();

  course.numberInStock--;
  course.save();
  
  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 