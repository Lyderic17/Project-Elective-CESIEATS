/* 
 * The code containing functions associated with the Menu's requests.
 * Author	: Rubisetcie
 */

// Importing the connector components
const ObjectID = require("mongodb").ObjectID;

// Importing the associated service
const service = require("../service/menuService");

// Importing the utils functions
const handleError = require("../utils/apiUtils").handleError;

// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

// Retrieving menu data by ID
module.exports.getById = function(req, res) {
    try {
        const id = req.params.id ? new ObjectID(req.params.id) : null;

        // Paramters verification
        if (!id)
            throw new ApiError("Parameter not recognized: id", 400);
        
        service.getById(id).then((result) => {
            res.json(result.toJson());
        }).catch((error) => {
            handleError(error, res, "retrieving menu");
        });
    } catch (err) {
        handleError(err, res, "retrieving menu");
    }
};

// Retrieving multiple menu data by restaurant ID
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
            handleError(error, res, "retrieving menu");
        });
    } catch (err) {
        handleError(err, res, "retrieving menu");
    }
};

// Retrieving multiple menu data by filter
module.exports.getAll = function(req, res) {
    try {
        // Parameters reading
        const limit = (req.query["limit"] || req.query["limit"] === 0) ? parseInt(req.query["limit"]) : null;
        const offset = (req.query["offset"] || req.query["offset"] === 0) ? parseInt(req.query["offset"]) : null;
        
        // Paramters verification
        if (limit) {
            if (isNaN(limit))   throw new ApiError("Parameter type not recognized: limit", 400);
            if (limit < 1)      throw new ApiError("Parameter below accepted value: limit below 1", 400);
        }
        
        if (offset) {
            if (isNaN(offset))  throw new ApiError("Parameter type not recognized: offset", 400);
            if (offset < 1)     throw new ApiError("Parameter below accepted value: offset below 1", 400);
        }
        
        service.getAll(limit, offset).then((result) => {
            const json = [];
            result.forEach((r) => {
                json.push(r.toJson());
            });
            res.json(json);
        }).catch((error) => {
            handleError(error, res, "retrieving menu");
        });
    } catch (err) {
        handleError(err, res, "retrieving menu");
    }
};