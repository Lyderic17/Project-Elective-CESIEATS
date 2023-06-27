// model/menu.js
class Menu {
  menu_ID; // ID du menu
  restaurant_ID; // ID du restaurant
  menu_name; // Nom du menu
  composition; // Composition du menu
  price; // Prix du menu
  status; // Statut du menu

  toJson = function() {
    const json = {};

    json["menu_ID"] = this.menu_ID;
    json["restaurant_ID"] = this.restaurant_ID;
    json["menu_name"] = this.menu_name;
    json["composition"] = this.composition;
    json["price"] = this.price;
    json["status"] = this.status;

    return json;
  }
}

module.exports = Menu;
