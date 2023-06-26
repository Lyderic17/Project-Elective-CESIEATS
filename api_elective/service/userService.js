/* 
 * The code containing the User related queries to the database.
 * Author	: Rubisetcie
 */

// Importing the associated connector
const connector = require("../connector/sqlConnector");
const mongoose = require("mongoose");
const Restaurant = require('../model/restaurant');

// Retrieving user data by ID
module.exports.getById = function(id) {
    return connector.selectUserById(id);
};

// Retrieving a single user by filter
module.exports.getOne = function(email) {
    return connector.selectOneUser(email);
};

// Create a new user
module.exports.post = function(user) {
    return connector.insertUser(user)
      .then((user) => {
        if (user.usertype === 3) {
          const restaurantData = {
            name: user.username,
            userId: user.userId,
          };
          return connector.createRestaurant(restaurantData)
            .then(() => user.userId);
        } else {
          return user.userId;
        }
      });
  };

// Updates an existing user
module.exports.put = function(user) {
    return connector.updateUser(user);
};
