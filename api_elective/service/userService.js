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

// Créer un nouvel utilisateur
module.exports.post = function(user) {
  return connector.insertUser(user);
};


// Updates an existing user
module.exports.put = function(user) {
  return connector.updateUser(user);
};
