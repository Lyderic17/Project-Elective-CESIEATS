const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true },
  acceptedAt: { type: Date },
  inProgressAt: { type: Date },
  completedAt: { type: Date }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
