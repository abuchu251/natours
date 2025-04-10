const fs = require('fs');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const Tour = require('../../models/toursModel');

dotenv.config({ path: './config.env' });
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
console.log(db);
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function DeleteData() {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
}
async function LoadData() {
  try {
    const temp = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');
    console.log(temp);
    const data = JSON.parse(temp);
    await Tour.create(data);
    console.log('Data loaded successfully');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
}
if (process.argv[2] === '--import') {
  LoadData();
}
if (process.argv[2] === '--delete') {
  DeleteData();
}
