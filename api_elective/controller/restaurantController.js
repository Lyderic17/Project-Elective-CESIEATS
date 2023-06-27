// Importing the associated service
const service = require("../service/restaurantService");
const Restaurant = require('../model/restaurant');

// Importing the utils functions
const handleError = require("../utils/apiUtils").handleError;

// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

module.exports.getOne = function(req, res) {
    try {
        // Reading parameters
        const id = req.query["id"];
    
        service.getById(id).then((result) => {
            res.json(result);
        }).catch((error) => {
            handleError(error, res, "retrieving restaurant");
        });
    } catch (err) {
        handleError(err, res, "retrieving restaurant");
    }
};

module.exports.post = function(req, res) {
    try {
        const restaurantData = req.body;
        
        service.post(restaurantData).then((result) => {
            res.json(result);
        }).catch((error) => {
            handleError(error, res, "creating restaurant");
        });
    } catch (err) {
        handleError(err, res, "creating restaurant");
    }
};

// Retrieving restaurant data by ID
module.exports.getById = function(req, res) {
    try {
        const id = req.params.id;

        // Paramters verification
        if (!id)
            throw new ApiError("Parameter not recognized: id", 400);
        
        service.getById(id).then((result) => {
            res.json(result.toJson());
        }).catch((error) => {
            handleError(error, res, "retrieving restaurant");
        });
    } catch (err) {
        handleError(err, res, "retrieving restaurant");
    }
};

module.exports.getAll = function(req, res) {
    try {
        const limit = (req.query["limit"] || req.query["limit"] === 0) ? parseInt(req.query["limit"]) : null;
        const offset = (req.query["offset"] || req.query["offset"] === 0) ? parseInt(req.query["offset"]) : null;
        
        if (limit) {
            if (isNaN(limit))   throw new ApiError("Parameter type not recognized: limit", 400);
            if (limit < 1)      throw new ApiError("Parameter below accepted value: limit below 1", 400);
        }
        
        if (offset) {
            if (isNaN(offset))  throw new ApiError("Parameter type not recognized: offset", 400);
            if (offset < 1)     throw new ApiError("Parameter below accepted value: offset below 1", 400);
        }
        
        service.getAll(offset, limit).then((result) => {
            res.json(result);
        }).catch((error) => {
            handleError(error, res, "retrieving restaurant");
        });
    } catch (err) {
        handleError(err, res, "retrieving restaurant");
    }
};
