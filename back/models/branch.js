const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchId: String,
  enterpriseNumber: String,
  StartDate: String,
  address: Array,
  denomination: Array
});

const Branch = mongoose.model('Branch', branchSchema, 'branch');

module.exports = Branch;
