const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
  enterpriseNumber: String,
  info: {
    Status: String,
    JuridicalSituation: String,
    TypeOfEnterprise: String,
    JuridicalForm: String,
    JuridicalFormCAC: String,
    StartDate: String
  },
  contact: Array,
  address: Array,
  denomination: Array,
  activity: Array
});

const Enterprise = mongoose.model('Enterprise', enterpriseSchema, 'enterprise');

module.exports = Enterprise;
