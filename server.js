const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const app = require('./app');
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(db, {
  // useNewUrlParser: true,
  useUnifiedTopology: true,
});
const server = app.listen(port, () => {
  console.log('App running on port: ' + port);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
