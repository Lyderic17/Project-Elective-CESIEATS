/* 
 * The code containing the Order related queries to the database.
 * Author	: Rubisetcie
 */

// Importing the associated connector
const connector = require("../connector/mongoConnector");

// Retrieving multiple orders data by client ID
module.exports.getByClientId = function(id) {
    return connector.selectOrderByClientId(id);
};

// Retrieving multiple orders data by restaurant ID
module.exports.getByRestaurantId = function(id) {
    return connector.selectOrderByRestaurantId(id);
};

// Retrieving multiple orders data by filter
module.exports.getAll = function(limit, offset, clientId, status) {
    return connector.selectOrder(limit, offset, clientId, status);
};

// Create an order
module.exports.post = function(order) {
    return connector.insertOrder(order);
};

// Update an order
module.exports.put = function(order) {
    return connector.updateOrder(order);
};

/* // Importer le modèle DeliveryPerson
const DeliveryPerson = require('../model/DeliveryPersonPos');

// Récupérer les commandes attribuées à un livreur spécifique
module.exports.getOrdersByDeliveryPerson = async function(deliveryPersonId) {
  try {
    const deliveryPerson = await DeliveryPerson.findOne({ deliveryPersonId });

    if (!deliveryPerson) {
      throw new Error(`Livreur introuvable : ${deliveryPersonId}`);
    }

    // Récupérer les commandes attribuées au livreur
    const orders = await Order.find({ deliveryPerson: deliveryPerson._id }).exec();

    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du livreur :', error);
    throw error;
  }
}; */