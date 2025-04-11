const dotenv = require('dotenv');
const app = require('./app');
const { default: mongoose } = require('mongoose');

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
app.listen(port, () => {
  console.log('App running on port: ' + port);
});
