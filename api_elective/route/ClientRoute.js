const express = require("express");
const router = express.Router();
const clientController = require("../controller/clientController");


// Route pour créer une commande
router.post("/order", clientController.createOrder);

module.exports = router;
