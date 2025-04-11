const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.use('*', (req, res, next) => {
  next(
    new AppError(
      `can't find the route ${req.originalUrl} from the server`,
      404,
    ),
  );
});
app.use(errorController);

module.exports = app;
