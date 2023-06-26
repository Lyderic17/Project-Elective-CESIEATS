const Order = require("../model/order");
const Address = require("../model/address");
const Price = require("../model/price");
const orderService = require("../service/orderService");

// Créer une commande
module.exports.createOrder = async function (req, res) {
  try {
    const { clientId, restaurantId, address, menus } = req.body;

    // Créer une instance de la commande
    const order = new Order();
    order.clientId = clientId;
    order.restaurantId = restaurantId;

    // Créer une instance de l'adresse
    const orderAddress = new Address();
    orderAddress.country = address.country;
    orderAddress.zipcode = address.zipcode;
    orderAddress.city = address.city;
    orderAddress.address = address.address;
    order.address = orderAddress;

    // Créer une instance des menus
    const orderMenus = menus.map((menuId) => ({ _id: menuId }));
    order.menus = orderMenus;

    // Enregistrer la commande dans la base de données
    await orderService.createOrder(order);

    res.status(201).json({ message: "Commande créée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ message: "Erreur lors de la création de la commande" });
  }
};
