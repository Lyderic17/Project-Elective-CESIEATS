
// Importing the connector components
// Import mongoose.Types.ObjectId for id conversion
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');
// Importing the models
const Restaurant = require("../model/restaurant");
const Menu = require("../model/menu");
const Order = require("../model/order");
const Opening = require("../model/opening");
const Address = require("../model/address");
const Price = require("../model/price");
const Image = require("../model/image");

// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

// Connection constants
/* const HOST = process.env.MONGO_HOST || "mongodb+srv://lyderic1:JbL86LYjSuPkSAoQ@cluster0corbeille.j2rawlj.mongodb.net/?retryWrites=true&w=majority";
const DATABASE = process.env.MONGO_DATABASE || "Elective"; */

/* // Connect to MongoDB
mongoose.connect(`${HOST}/${DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  }); */
  module.exports.selectRestaurantById = function(id) {
    return new Promise((resolve, reject) => {
        Restaurant.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            {
                $lookup: {
                    from: "menus",
                    localField: "menus._id",
                    foreignField: "_id",
                    as: "menus"
                }
            }
        ]).exec((err, result) => {
            if (err) {
                reject(err);
            } else if (!result.length) {
                reject(new ApiError("Query returned nothing", 400));
            } else {
                const restaurant = deserializeRestaurant(result[0]);
                console.log("Request finished");
                resolve(restaurant);
            }
        });
    });
};

module.exports.selectRestaurant = async function(limit, offset, status) {
    try {
        let query = Restaurant.find();

        // Filter by status
        if (status) {
            query = query.where('status').in(status);
        }

        // Offset handling
        if (offset) {
            query = query.skip(offset);
        }

        // Limit handling
        if (limit) {
            query = query.limit(limit);
        }

        // Execute the query and get the result
        const results = await query.sort({ _id: 1 }).populate('menus').exec();

        const restaurants = results.map(deserializeRestaurant);
        console.log(`${restaurants.length} rows returned`);

        return restaurants;
    } catch (err) {
        throw err;
    }
};
// Select menu by ID
module.exports.selectMenuById = async function(id) {
    try {
        const result = await Menu.findById(id).exec();

        if (!result) {
            throw new ApiError("Query returned nothing", 400);
        }

        const menu = deserializeMenu(result);
        console.log("Request finished");

        return menu;
    } catch (err) {
        throw err;
    }
};

// Select menu by restaurant ID
module.exports.selectMenuByRestaurantId = async function(id) {
    try {
        const restaurant = await Restaurant.findById(id).populate('menus').exec();

        if (!restaurant) {
            throw new ApiError("Query returned nothing", 400);
        }

        const menus = restaurant.menus.map(deserializeMenu);
        console.log(`${menus.length} rows returned`);

        return menus;
    } catch (err) {
        throw err;
    }
};

// Select menu
module.exports.selectMenu = async function(limit, offset) {
    try {
        let query = Menu.find();

        // Offset handling
        if (offset) {
            query = query.skip(offset);
        }

        // Limit handling
        if (limit) {
            query = query.limit(limit);
        }

        // Execute the query and get the result
        const results = await query.exec();

        const menus = results.map(deserializeMenu);
        console.log(`${menus.length} rows returned`);

        return menus;
    } catch (err) {
        throw err;
    }
};

// Select order by client ID
module.exports.selectOrderByClientId = async function(id) {
    try {
        const orders = await Order.find({ clientId: id }).populate('menus').sort({ clientId: 1 }).exec();
        const results = orders.map(deserializeOrder);
        console.log(`${results.length} rows returned`);
        return results;
    } catch (err) {
        throw err;
    }
};

// Select order by restaurant ID
module.exports.selectOrderByRestaurantId = async function(id) {
    try {
        const orders = await Order.find({ restaurantId: id }).populate('menus').sort({ restaurantId: 1 }).exec();
        const results = orders.map(deserializeOrder);
        console.log(`${results.length} rows returned`);
        return results;
    } catch (err) {
        throw err;
    }
};

// Select order
module.exports.selectOrder = async function(limit, offset, clientId, status) {
    try {
        let query = Order.find();

        // Apply client filter if provided
        if (clientId) {
            query = query.where('clientId').equals(clientId);
        }

        // Apply status filter if provided
        if (status) {
            query = query.where('status').in(status);
        }

        // Offset handling
        if (offset) {
            query = query.skip(offset);
        }

        // Limit handling
        if (limit) {
            query = query.limit(limit);
        }

        query = query.sort({ _id: 1 }).populate('menus');

        const results = await query.exec();
        const orders = results.map(deserializeOrder);
        console.log(`${orders.length} rows returned`);

        return orders;
    } catch (err) {
        throw err;
    }
};



// Insert order
module.exports.insertOrder = async function(order) {
    try {
        const newOrder = new Order(order.toJson());
        await newOrder.save();
        console.log("Request finished");
    } catch (err) {
        throw err;
    }
};

// Update order
module.exports.updateOrder = async function(order) {
    try {
        const update = {};
        
        if (order.clientId)     update["clientId"] = order.clientId;
        if (order.restaurantId) update["restaurantId"] = order.restaurantId;
        if (order.address)      update["address"] = order.address;
        if (order.date)         update["date"] = order.date;
        if (order.status)       update["status"] = order.status;
        if (order.taxes)        update["taxes"] = order.taxes;
        if (order.menus)        update["menus"] = order.menus;
        if (order.assign)       update["assign"] = order.assign;

        await Order.updateOne({ _id: order.id }, { $set: update });
        console.log("Request finished");
    } catch (err) {
        throw err;
    }
};
// Create a new menu
module.exports.createMenu = async function(menuData) {
    try {
      const menu = new Menu(menuData);
      const result = await menu.save();
      console.log("Menu created:", result);
      return result;
    } catch (err) {
      throw err;
    }
  };
  
// Creates a Restaurant object from JSON
deserializeRestaurant = function(json) {
    const restaurant = new Restaurant;
    const address = new Address;
    const image = new Image;
            
    const restaurantAddress = json["address"];
    if (restaurantAddress) {
        address.country = restaurantAddress["country"] ? restaurantAddress["country"] : null;
        address.zipcode = restaurantAddress["zipcode"] ? restaurantAddress["zipcode"] : null;
        address.city = restaurantAddress["city"] ? restaurantAddress["city"] : null;
        address.address = restaurantAddress["address"] ? restaurantAddress["address"] : null;
    }

    const restaurantImage = json["image"];
    if (restaurantImage) {
        image.url = restaurantImage["url"] ? restaurantImage["url"] : null;
        image.alt = restaurantImage["alt"] ? restaurantImage["alt"] : null;
    }

    restaurant.id = json["_id"];
    restaurant.name = json["name"] ? json["name"] : null;
    restaurant.address = address;
    restaurant.status = json["status"] ? json["status"] : null;
    restaurant.image = image;

    restaurant.openings = [];
    if (json["openings"] && Array.isArray(json["openings"])) {
        json["openings"].forEach((op) => {
            const opening = new Opening;

            opening.open = op["open"];
            opening.close = op["close"];

            restaurant.openings.push(opening);
        });
    }

    restaurant.tags = json["tags"] ? json["tags"] : [];
    restaurant.description = json["description"] ? json["description"] : null;

    restaurant.menus = [];
    if (json["menus"] && Array.isArray(json["menus"])) {
        json["menus"].forEach((me) => {
            restaurant.menus.push(deserializeMenu(me));
        });
    }
    
    return restaurant;
};

// Creates a Menu object from JSON
deserializeMenu = function(json) {
    const menu = new Menu;
    const image = new Image;
    const price = new Price;
    
    const menuImage = json["image"];
    if (menuImage) {
        image.url = menuImage["url"] ? menuImage["url"] : null;
        image.alt = menuImage["alt"] ? menuImage["alt"] : null;
    }

    const menuPrice = json["price"];
    if (menuPrice) {
        price.value = menuPrice["value"] ? menuPrice["value"] : null;
        price.currency = menuPrice["currency"] ? menuPrice["currency"] : null;
    }

    menu.id = json["_id"];
    menu.name = json["name"] ? json["name"] : null;
    menu.image = image;
    menu.price = price;

    menu.items = json["items"] ? json["items"] : [];
    
    return menu;
};

// Creates an Order object from JSON
deserializeOrder = function(json) {
    const order = new Order;
    const address = new Address;
    const taxes = new Price;
            
    const orderAddress = json["address"];
    if (orderAddress) {
        address.country = orderAddress["country"] ? orderAddress["country"] : null;
        address.zipcode = orderAddress["zipcode"] ? orderAddress["zipcode"] : null;
        address.city = orderAddress["city"] ? orderAddress["city"] : null;
        address.address = orderAddress["address"] ? orderAddress["address"] : null;
    }
    
    const orderTaxes = json["taxes"];
    if (orderTaxes) {
        taxes.value = orderTaxes["value"] ? orderTaxes["value"] : null;
        taxes.currency = orderTaxes["currency"] ? orderTaxes["currency"] : null;
    }
    
    order.id = json["_id"];
    order.clientId = json["clientId"];
    order.restaurantId = json["restaurantId"];
    order.address = address;
    order.date = json["date"] ? new Date(json["date"]) : null;
    order.status = json["status"] ? json["status"] : null;
    order.taxes = taxes;
    order.menus = [];
    order.assign = json["assign"] ? json["assign"] : null;
    
    order.menus = [];
    if (json["menus"] && Array.isArray(json["menus"])) {
        json["menus"].forEach((me) => {
            order.menus.push(deserializeMenu(me));
        });
    }
    
    return order;
};

// Trigger connection
/* client.connect((err) => {
    if (err) {
        console.error("Error while connecting to MongoDB Database", err);
    } else {
        console.log("Connected to MongoDB Database");
    }
}); */