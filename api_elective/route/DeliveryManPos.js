const express = require('express');
const router = express.Router();
const DeliveryController = require('../controller/DeliveryController');

// Mettre à jour la position du livreur
router.post('/delivery-person/:id/location', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  DeliveryController.updateDeliveryPersonLocation(id, latitude, longitude)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de la position du livreur :', error);
      res.sendStatus(500);
    });
});

router.get("/orders/available", controller.getAvailableOrders);

module.exports = router;
