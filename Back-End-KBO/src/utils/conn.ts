import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config()

const uri = process.env.URL_MONGO || ''

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

export default db;