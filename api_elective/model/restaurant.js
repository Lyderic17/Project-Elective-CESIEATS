const mongoose = require('mongoose');
const Menu = require('./menu');

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: {
    country: String,
    zipcode: String,
    city: String,
    address: String
  },
  status: String,
  image: {
    url: String,
    alt: String
  },
  openings: [{ open: String, close: String }],
  tags: [String],
  description: String,
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Added createdBy field to associate the restaurant with the user
}, { collection: 'restaurants' });

restaurantSchema.methods.toJson = function() {
  return {
    id: this._id,
    name: this.name,
    address: this.address,
    status: this.status,
    image: this.image,
    openings: this.openings,
    tags: this.tags,
    description: this.description,
    menus: this.menus
  };
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
