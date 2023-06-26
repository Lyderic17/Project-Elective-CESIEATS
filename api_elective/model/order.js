const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true },
  taxes: { type: mongoose.Schema.Types.ObjectId, ref: 'Price' },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  assign: { type: String }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
