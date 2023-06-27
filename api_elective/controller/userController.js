// Importing the associated service
const service = require("../service/userService");
// Importing the utils functions
const handleError = require("../utils/apiUtils").handleError;
const connector = require('../connector/sqlConnector')
// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

// Importing the models
const User = require("../model/user");
const Address = require("../model/address");
const Billing = require("../model/billing");

// Retrieving user data by ID
module.exports.getById = function(req, res) {
    try {
        const id = parseInt(req.params.id, 10);

        // Parameters verification
        if (isNaN(id))
            throw new ApiError("Parameter type not recognized: id", 400);

        service.getById(id).then((result) => {
            res.json(result);
        }).catch((error) => {
            handleError(error, res, "retrieving user");
        });
    } catch (err) {
        handleError(err, res, "retrieving user");
    }
};

// Retrieving a single user by filter
module.exports.getOne = function(req, res) {
    try {
        // Parameters reading
        const email = req.query["email"];
    
        service.getOne(email).then((result) => {
            res.json(result);
        }).catch((error) => {
            handleError(error, res, "retrieving user");
        });
    } catch (err) {
        handleError(err, res, "retrieving user");
    }
};

// Create a new user
module.exports.post = function(req, res) {
    try {
        const user = new User();
        const address = new Address();
        const billing = new Billing();
        
        // Parameters reading
        if (!req.body)
            throw new ApiError("Request body is undefined", 400);
        
        const userAddress = req.body["address"];
        if (userAddress) {
            address.country = userAddress["country"] ? userAddress["country"] : null;
            address.zipcode = userAddress["zipcode"] ? userAddress["zipcode"] : null;
            address.city = userAddress["city"] ? userAddress["city"] : null;
            address.address = userAddress["address"] ? userAddress["address"] : null;
        }
        
        const userBilling = req.body["billing"];
        if (userBilling) {
            billing.number = userBilling["number"] ? userBilling["number"] : null;
            billing.crypto = userBilling["crypto"] ? userBilling["crypto"] : null;
            billing.owner = userBilling["owner"] ? userBilling["owner"] : null;
        }
        
        user.name = req.body["name"] ? req.body["name"] : null;
        user.lastname = req.body["lastname"] ? req.body["lastname"] : null;
        user.mail = req.body["mail"] ? req.body["mail"] : null;
        user.password = req.body["password"] ? req.body["password"] : null;
        user.phone = req.body["phone"] ? req.body["phone"] : null;
        user.referer = req.body["referer"] ? req.body["referer"] : null;
        user.nb_referer = req.body["nb_referer"] ? req.body["nb_referer"] : null;
        user.role = req.body["role"] ? req.body["role"] : null;
        user.rating = req.body["rating"] ? req.body["rating"] : null;
        user.address = address;
        user.crea_date = req.body["crea_date"] ? req.body["crea_date"] : null;

        // Parameters verification
        if (!user.name)             throw new ApiError("Missing mandatory parameter: name", 400);
        if (!user.lastname)         throw new ApiError("Missing mandatory parameter: lastname", 400);
        if (!user.mail)             throw new ApiError("Missing mandatory parameter: mail", 400);
        if (!user.password)         throw new ApiError("Missing mandatory parameter: password", 400);
        if (!user.phone)            throw new ApiError("Missing mandatory parameter: phone", 400);
        if (!user.referer)          throw new ApiError("Missing mandatory parameter: referer", 400);
        if (!user.nb_referer)       throw new ApiError("Missing mandatory parameter: nb_referer", 400);
        if (!user.role)             throw new ApiError("Missing mandatory parameter: role", 400);
        if (!user.address)          throw new ApiError("Missing mandatory parameter: zipcode", 400);

        service.post(user).then((id) => {
            res.json({ "id": id });
        }).catch((error) => {
            handleError(error, res, "creating user");
        });
    } catch (err) {
        handleError(err, res, "creating user");
    }
};

// Updates an existing user
module.exports.put = function(req, res) {
    try {
        const user = new User();
        
        // Parameters reading
        if (!req.body)
            throw new ApiError("Request body is undefined", 400);
        
        user.id = (req.body["id"] || req.body["id"] === 0) ? req.body["id"] : null;
        user.username = req.body["username"] ? req.body["username"] : null;
        user.usertype = (req.body["usertype"] || req.body["usertype"] === 0) ? parseInt(req.body["usertype"]) : null;
        user.email = req.body["email"] ? req.body["email"] : null;
        user.password = req.body["password"] ? req.body["password"] : null;
        user.firstname = req.body["firstname"] ? req.body["firstname"] : null;
        user.lastname = req.body["lastname"] ? req.body["lastname"] : null;

        // Parameters verification
        if (!user.id)
            throw new ApiError("Missing mandatory parameter: id", 400);

        service.put(user).then(() => {
            res.status(204).send();
        }).catch((error) => {
            handleError(error, res, "updating user");
        });
    } catch (err) {
        handleError(err, res, "updating user");
    }
};
