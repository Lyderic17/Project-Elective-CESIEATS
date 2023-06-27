/* 
 * The code containing the Menu related queries to the database.
 * Author	: Rubisetcie
 */
const mongoose = require('mongoose');
// Importing the associated connector
const connector = require("../connector/sqlConnector");
const Menu = require("../model/menu");

// Retrieving menu data by ID
module.exports.getById = function(id) {
    return connector.selectMenuById(id);
};

// Retrieving multiple menu data by restaurant ID
module.exports.getByRestaurantId = function(id) {
    return connector.selectMenuByRestaurantId(id);
};

module.exports.getMenuByUserId = function(userId) {
  return connector.selectMenuByUserId(userId);
};

// Retrieving multiple menu data by filter
module.exports.getAll = function(limit, offset) {
    return connector.selectMenu(limit, offset);
};

// Récupérer tous les menus créés par un restaurateur
module.exports.getMenusByRestaurateurId = function(restaurateurId) {
  return connector.selectMenusByRestaurateurId(restaurateurId);
};

// Create a new menu
module.exports.createMenu = function(menuData) {
  const restaurant = connector.selectRestaurantByOwnerId(menuData.restaurateurId);
  if (!restaurant) {
    throw new ApiError("Restaurant not found", 404);
  }

  const menu = new Menu({
    restaurant_ID: restaurant.restaurant_ID,
    menu_name: menuData.menu_name,
    composition: menuData.composition,
    price: menuData.price,
    status: menuData.status
  });

  return connector.createMenu(menu);
};
  
  