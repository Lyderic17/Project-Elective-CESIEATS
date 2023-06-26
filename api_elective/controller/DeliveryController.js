const DeliveryPerson = require('../model/DeliveryPersonPos');
const Delivery = require('../model/Delivery');

async function updateDeliveryPersonLocation(deliveryPersonId, latitude, longitude) {
  try {
    const deliveryPerson = await DeliveryPerson.findOne({ deliveryPersonId });

    if (!deliveryPerson) {
      // Créer un nouvel enregistrement s'il n'existe pas
      await DeliveryPerson.create({
        deliveryPersonId,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      });
    } else {
      // Mettre à jour la position si l'enregistrement existe
      deliveryPerson.location.coordinates = [longitude, latitude];
      deliveryPerson.timestamp = new Date();
      await deliveryPerson.save();
    }
  } catch (error) {
    console.error('Échec de la mise à jour de la position du livreur :', error);
  }
}
async function acceptDelivery(deliveryPersonId, deliveryId) {
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      throw new Error(`Livraison introuvable avec l'ID ${deliveryId}`);
    }

    if (delivery.deliveryPersonId) {
      throw new Error('Cette livraison a déjà été acceptée par un autre livreur.');
    }

    if (delivery.status !== 'pending') {
      throw new Error('Cette livraison ne peut pas être acceptée car elle a déjà été traitée.');
    }

    // Mettre à jour la livraison avec les détails du livreur
    delivery.deliveryPersonId = deliveryPersonId;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();

    await delivery.save();

    console.log(`Livraison ${deliveryId} acceptée par le livreur ${deliveryPersonId}`);

    // Autres actions à effectuer après avoir accepté la livraison si nécessaire

    return delivery;
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la livraison :', error);
    throw error;
  }
}async function refuseDelivery(deliveryId) {
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      throw new Error(`Livraison introuvable avec l'ID ${deliveryId}`);
    }

    if (delivery.status !== 'pending') {
      throw new Error('Cette livraison ne peut pas être refusée car elle a déjà été traitée.');
    }

    // Mettre à jour l'état de la livraison
    delivery.status = 'refused';
    delivery.refusedAt = new Date();

    await delivery.save();

    console.log(`Livraison ${deliveryId} refusée`);

    // Autres actions à effectuer après avoir refusé la livraison si nécessaire

    return delivery;
  } catch (error) {
    console.error('Erreur lors du refus de la livraison :', error);
    throw error;
  }
}

async function takeDelivery(deliveryId) {
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      throw new Error(`Livraison introuvable avec l'ID ${deliveryId}`);
    }

    if (delivery.status !== 'accepted') {
      throw new Error('Cette livraison ne peut pas être prise en charge car elle n\'a pas été acceptée.');
    }

    // Mettre à jour l'état de la livraison
    delivery.status = 'in_progress';
    delivery.inProgressAt = new Date();

    await delivery.save();

    console.log(`Livraison ${deliveryId} prise en charge`);

    // Autres actions à effectuer après avoir pris en charge la livraison si nécessaire

    return delivery;
  } catch (error) {
    console.error('Erreur lors de la prise en charge de la livraison :', error);
    throw error;
  }
}

async function completeDelivery(deliveryId) {
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      throw new Error(`Livraison introuvable avec l'ID ${deliveryId}`);
    }

    if (delivery.status !== 'in_progress') {
      throw new Error('Cette livraison ne peut pas être complétée car elle n\'est pas en cours.');
    }

    // Mettre à jour l'état de la livraison
    delivery.status = 'completed';
    delivery.completedAt = new Date();

    await delivery.save();

    console.log(`Livraison ${deliveryId} complétée`);

    // Autres actions à effectuer après avoir complété la livraison si nécessaire

    return delivery;
  } catch (error) {
    console.error('Erreur lors de la complétion de la livraison :', error);
    throw error;
  }
}
async function getDeliveryPersonPosition(deliveryPersonId) {
  try {
    // Trouver la position la plus récente pour ce livreur
    const position = await DeliveryPerson.findOne({ deliveryPersonId }).sort({ timestamp: -1 }).exec();

    if (!position) {
      throw new Error(`Aucune position connue pour le livreur ${deliveryPersonId}`);
    }

    return position;
  } catch (err) {
    console.error('Erreur lors de la récupération de la position du livreur :', err);
    throw err;
  }
}

module.exports = {
  updateDeliveryPersonLocation,
  getDeliveryPersonPosition,
  completeDelivery,
  takeDelivery,
  refuseDelivery,
  acceptDelivery
};
