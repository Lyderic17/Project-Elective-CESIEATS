/* 
 * The code containing the Menu related queries to the database.
 * Author	: Rubisetcie
 */
const mongoose = require('mongoose');
// Importing the associated connector
const connector = require("../connector/mongoConnector");
const Menu = require("../model/menu");

// Retrieving menu data by ID
module.exports.getById = function(id) {
    return connector.selectMenuById(id);
};

// Retrieving multiple menu data by restaurant ID
module.exports.getByRestaurantId = function(id) {
    return connector.selectMenuByRestaurantId(id);
};

// Retrieving multiple menu data by filter
module.exports.getAll = function(limit, offset) {
    return connector.selectMenu(limit, offset);
};

// Create a new menu
module.exports.createMenu = function(menuData) {
    try {
      const menu = new Menu({
        name: menuData.name,
        image: {
          url: menuData.image.url,
          alt: menuData.image.alt
        },
        elements: menuData.elements,
        price: menuData.price
      });
      
      return connector.createMenu(menu);
    } catch (err) {
      throw err;
    }
  };
  
  