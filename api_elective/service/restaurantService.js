/* 
 * The code containing the Restaurant related queries to the database.
 */
const { Restaurant } = require("../model/restaurant");
// Importing the associated connector
const connector = require("../connector/sqlConnector");



// Service.js
module.exports.getAll = function(offset, limit) {
        return connector.selectAllRestaurants(offset, limit);
};
// Retrieving restaurant data by ID
module.exports.getById = function(id) {
    return connector.selectRestaurantById(id);
};

// Creating a new restaurant
module.exports.post = function(restaurant) {
    return connector.createRestaurant(restaurant);
};