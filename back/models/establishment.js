const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
  establishmentNumber: String,
  enterpriseNumber: String,
  StartDate: String,
  address: Array,
  denomination: Array,
  activity: Array
});

const Establishment = mongoose.model('Establishment', establishmentSchema, 'establishment');

module.exports = Establishment;
