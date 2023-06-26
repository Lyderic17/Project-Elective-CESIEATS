/* 
 * The code containing functions associated with the Order's requests.
 * Author	: Rubisetcie
 */

// Importing the connector components
const ObjectID = require("mongodb").ObjectID;

// Importing the associated service
const service = require("../service/orderService");

// Importing the utils functions
const handleError = require("../utils/apiUtils").handleError;

// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

// Importing the models
const Order = require("../model/order");
const Address = require("../model/address");
const Price = require("../model/price");


// Accept a delivery
exports.acceptDelivery = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(orderId, { status: "accepted" }, { new: true });
      res.status(200).json(order);
    } catch (error) {
      console.error("Failed to accept the delivery:", error);
      res.status(500).json({ error: "Failed to accept the delivery" });
    }
  };
  
  // Reject a delivery
  exports.rejectDelivery = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByIdAndUpdate(orderId, { status: "rejected" }, { new: true });
      res.status(200).json(order);
    } catch (error) {
      console.error("Failed to reject the delivery:", error);
      res.status(500).json({ error: "Failed to reject the delivery" });
    }
  };
// Retrieving multiple order data by client ID
module.exports.getByClientId = function(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        
        // Paramters verification
        if (isNaN(id))
            throw new ApiError("Parameter not recognized: id", 400);
        
        service.getByClientId(id).then((result) => {
            const json = [];
            result.forEach((r) => {
                json.push(r.toJson());
            });
            res.json(json);
        }).catch((error) => {
            handleError(error, res, "retrieving order");
        });
    } catch (err) {
        handleError(err, res, "retrieving order");
    }
};

// Retrieving multiple order data by restaurant ID
module.exports.getByRestaurantId = function(req, res) {
    try {
        const id = req.params.id ? new ObjectID(req.params.id) : null;
        
        // Paramters verification
        if (!id)
            throw new ApiError("Parameter not recognized: id", 400);
        
        service.getByRestaurantId(id).then((result) => {
            const json = [];
            result.forEach((r) => {
                json.push(r.toJson());
            });
            res.json(json);
        }).catch((error) => {
            handleError(error, res, "retrieving order");
        });
    } catch (err) {
        handleError(err, res, "retrieving order");
    }
};

// Retrieving multiple order data by filter
module.exports.getAll = function(req, res) {
    try {
        // Parameters reading
        const limit = (req.query["limit"] || req.query["limit"] === 0) ? parseInt(req.query["limit"]) : null;
        const offset = (req.query["offset"] || req.query["offset"] === 0) ? parseInt(req.query["offset"]) : null;
        const clientId = (req.query["client"] || req.query["client"] === 0) ? parseInt(req.query["client"]) : null;
        const status = req.query["status"] ? req.query["status"].split(';') : null;
        
        // Paramters verification
        if (limit) {
            if (isNaN(limit))   throw new ApiError("Parameter type not recognized: limit", 400);
            if (limit < 1)      throw new ApiError("Parameter below accepted value: limit below 1", 400);
        }
        
        if (offset) {
            if (isNaN(offset))  throw new ApiError("Parameter type not recognized: offset", 400);
            if (offset < 1)     throw new ApiError("Parameter below accepted value: offset below 1", 400);
        }

        if (clientId) {
            if (isNaN(clientId))
                throw new ApiError("Parameter type not recognized: clientId", 400);
        }
        
        if (status) {
            if (!Array.isArray(status))
                throw new ApiError("Parameter type not recognized: status", 400);
        }
        
        service.getAll(limit, offset, clientId, status).then((result) => {
            const json = [];
            result.forEach((r) => {
                json.push(r.toJson());
            });
            res.json(json);
        }).catch((error) => {
            handleError(error, res, "retrieving order");
        });
    } catch (err) {
        handleError(err, res, "retrieving order");
    }
};

// Create an order
module.exports.post = function(req, res) {
    try {
        const order = new Order;
        const address = new Address;
        const taxes = new Price;
        const menus = [];
        
        // Parameters reading
        if (!req.body)
            throw new ApiError("Request body is undefined", 400);
        
        const orderAddress = req.body["address"];
        if (orderAddress) {
            address.country = orderAddress["country"] ? orderAddress["country"] : null;
            address.zipcode = orderAddress["zipcode"] ? orderAddress["zipcode"] : null;
            address.city = orderAddress["city"] ? orderAddress["city"] : null;
            address.address = orderAddress["address"] ? orderAddress["address"] : null;
        }
        
        const orderTaxes = req.body["taxes"];
        if (orderTaxes) {
            taxes.value = (orderTaxes["value"] || orderTaxes["value"] === 0) ? parseFloat(orderTaxes["value"]) : null;
            taxes.currency = orderTaxes["currency"] ? orderTaxes["currency"] : null;
        }
        
        const orderMenus = req.body["menus"];
        if (orderMenus) {
            if (Array.isArray(orderMenus)) {
                orderMenus.forEach((menu) => {
                    menus.push({ _id: menu });
                });
            }
        }
        
        order.clientId = (req.body["clientId"] || req.body["clientId"] === 0) ? parseInt(req.body["clientId"]) : null;
        order.restaurantId = req.body["restaurantId"] ? new ObjectID(req.body["restaurantId"]) : null;
        order.address = address;
        order.date = req.body["date"] ? new Date(Date.parse(req.body["date"])) : null;
        order.status = req.body["status"] ? req.body["status"] : null;
        order.taxes = taxes;
        order.menus = menus;
        order.assign = req.body["assign"] ? req.body["assign"] : null;

        // Paramters verification
        if (!order.clientId)            throw new ApiError("Missing mandatory parameter: clientId", 400);
        if (isNaN(order.clientId))      throw new ApiError("Parameter type not recognized: clientId", 400);
        if (!order.restaurantId)        throw new ApiError("Missing mandatory parameter: restaurantId", 400);
        if (!order.date)                throw new ApiError("Missing mandatory parameter: date", 400);
        if (!order.status)              throw new ApiError("Missing mandatory parameter: status", 400);
        
        if (!address.country)           throw new ApiError("Missing mandatory parameter: address country", 400);
        if (!address.zipcode)           throw new ApiError("Missing mandatory parameter: address zipcode", 400);
        if (!address.city)              throw new ApiError("Missing mandatory parameter: address city", 400);
        if (!address.address)           throw new ApiError("Missing mandatory parameter: address", 400);
        
        if (!taxes.value)               throw new ApiError("Missing mandatory parameter: taxes value", 400);
        if (isNaN(taxes.value))         throw new ApiError("Parameter type not recognized: taxes value", 400);
        if (!taxes.currency)            throw new ApiError("Missing mandatory parameter: taxes currency", 400);

        service.post(order).then(() => {
            res.status(204).send();
        }).catch((error) => {
            handleError(error, res, "creating order");
        });
    } catch (err) {
        handleError(err, res, "creating order");
    }
};

// Update an order
module.exports.put = function(req, res) {
    try {
        const order = new Order;
        const address = new Address;
        const taxes = new Price;
        const menus = [];
        
        // Parameters reading
        if (!req.body)
            throw new ApiError("Request body is undefined", 400);
        
        const orderAddress = req.body["address"];
        if (orderAddress) {
            address.country = orderAddress["country"] ? orderAddress["country"] : null;
            address.zipcode = orderAddress["zipcode"] ? orderAddress["zipcode"] : null;
            address.city = orderAddress["city"] ? orderAddress["city"] : null;
            address.address = orderAddress["address"] ? orderAddress["address"] : null;
        }
        
        const orderTaxes = req.body["taxes"];
        if (orderTaxes) {
            taxes.value = (orderTaxes["value"] || orderTaxes["value"] === 0) ? parseInt(orderTaxes["value"]) : null;
            taxes.currency = orderTaxes["currency"] ? orderTaxes["currency"] : null;
        }
        
        const orderMenus = req.body["menus"];
        if (orderMenus) {
            if (Array.isArray(orderMenus)) {
                orderMenus.forEach((menu) => {
                    menus.push({ _id: menu });
                });
            }
        }
        
        order.id = req.body["id"] ? new ObjectID(req.body["id"]) : null;
        order.clientId = (req.body["clientId"] || req.body["clientId"] === 0) ? parseInt(req.body["clientId"]) : null;
        order.restaurantId = req.body["restaurantId"] ? new ObjectID(req.body["restaurantId"]) : null;
        order.address = address;
        order.date = req.body["date"] ? new Date(Date.parse(req.body["date"])) : null;
        order.status = req.body["status"] ? req.body["status"] : null;
        order.taxes = taxes;
        order.menus = menus;
        order.assign = req.body["assign"] ? req.body["assign"] : null;

        // Paramters verification
        if (!order.id)
            throw new ApiError("Missing mandatory parameter: id", 400);

        service.put(order).then(() => {
            res.status(204).send();
        }).catch((error) => {
            handleError(error, res, "updating order");
        });
    } catch (err) {
        handleError(err, res, "updating order");
    }
};