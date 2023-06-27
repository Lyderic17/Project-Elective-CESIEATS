class Restaurant {
  restaurant_ID; // ID du restaurant
  owner_ID; // ID du propriétaire du restaurant
  rest_name; // Nom du restaurant
  address; // Adresse du restaurant
  phone; // Téléphone du restaurant
  crea_date; // Date de création du restaurant
  rating; // Note du restaurant
  status; // Statut du restaurant

  toJson = function() {
    const json = {};

    json["restaurant_ID"] = this.restaurant_ID;
    json["owner_ID"] = this.owner_ID;
    json["rest_name"] = this.rest_name;
    json["address"] = this.address;
    json["phone"] = this.phone;
    json["crea_date"] = this.crea_date;
    json["rating"] = this.rating;
    json["status"] = this.status;

    return json;
  }
}

module.exports = Restaurant;
