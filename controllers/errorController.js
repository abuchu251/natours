const AppError = require('../utils/AppError');

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
function sendErrorProd(err, res) {
  if (!err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong 💥',
    });
  }
}
function handleInvalidId(err) {
  return new AppError(`Invalid ${err.path}:${err.value} `, 400);
}
function handleDuplicateFields(err) {
  const val = `${err.errorResponse.errmsg}`.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${val}. Please use another value!`;
  return new AppError(message, 400);
}
function handleValidationEB(err) {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${error.join(' ')}`;
  return new AppError(message, 400);
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log(err);
    if (error.name === 'CastError') {
      error = handleInvalidId(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFields(err);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationEB(err);
    }
    sendErrorProd(error, res);
  }
};
