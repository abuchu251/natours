const fs = require('fs');
const Tour = require('./../models/toursModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
// );
// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const exceptionObj = ['page', 'limit'];
    exceptionObj.forEach((el) => delete queryObj[el]);
    const query = Tour.find(queryObj);
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.addNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const message = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send(`tour deleted ${message}`);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
