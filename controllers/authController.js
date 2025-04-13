const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_PHRASE, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please enter email and password', 400));
  const user = await User.findOne({ email }).select('+password ');
  console.log(user);

  if (!user || (await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 400));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});
