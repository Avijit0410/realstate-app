const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  ownerNumber: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [{
    type: String,
    required: true
  }],
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  }
}, {
  timestamps: true
});

propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema); 