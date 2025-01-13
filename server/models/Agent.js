const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // This ensures password isn't returned in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'agent'],
    default: 'agent'
  },
  address: String,
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema); 