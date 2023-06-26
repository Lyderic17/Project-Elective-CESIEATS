const mongoose = require('mongoose');

const DeliveryPersonSchema = new mongoose.Schema({
  deliveryPersonId: String,
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  timestamp: { type: Date, default: Date.now },
});

DeliveryPersonSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);