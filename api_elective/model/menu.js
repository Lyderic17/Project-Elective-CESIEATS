const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  image: {
    url: String,
    alt: String
  },
  elements: [String],
  price: { type: mongoose.Schema.Types.ObjectId, ref: 'Price' }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
