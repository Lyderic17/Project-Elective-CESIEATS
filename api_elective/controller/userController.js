/* 
 * The code containing functions associated with the User's requests.
 * Author	: Rubisetcie
 */

// Importing the associated service
const service = require("../service/userService");
const Restaurant = require('../model/restaurant')
// Importing the utils functions
const handleError = require("../utils/apiUtils").handleError;

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

        // Paramters verification
        if (isNaN(id))
            throw new ApiError("Parameter type not recognized: id", 400);

        service.getById(id).then((result) => {
            res.json(result.toJson());
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
            res.json(result.toJson());
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
        const user = new User;
        const address = new Address;
        const billing = new Billing;
        
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
        
        user.username = req.body["username"] ? req.body["username"] : null;
        user.usertype = (req.body["usertype"] || req.body["usertype"] === 0) ? parseInt(req.body["usertype"]) : null;
        user.email = req.body["email"] ? req.body["email"] : null;
        user.password = req.body["password"] ? req.body["password"] : null;
        user.firstname = req.body["firstname"] ? req.body["firstname"] : null;
        user.lastname = req.body["lastname"] ? req.body["lastname"] : null;
        user.address = address;
        user.billing = billing;

        // Paramters verification
        if (!user.username)         throw new ApiError("Missing mandatory parameter: username", 400);
        if (!user.usertype)         throw new ApiError("Missing mandatory parameter: usertype", 400);
        if (isNaN(user.usertype))   throw new ApiError("Parameter type not recognized: usertype", 400);
        if (!user.email)            throw new ApiError("Missing mandatory parameter: email", 400);
        if (!user.password)         throw new ApiError("Missing mandatory parameter: password", 400);
        
        if (!address.country)       throw new ApiError("Missing mandatory parameter: country", 400);
        if (!address.zipcode)       throw new ApiError("Missing mandatory parameter: zipcode", 400);

        service.post(user).then((userId) => {
/*             if (user.usertype === 3) {
              const restaurant = new Restaurant({
                name: req.body["restaurantName"], // Récupérez le nom du restaurant depuis la requête
                createdBy: userId
              });
      
              // Enregistrement du restaurant dans la base de données
              // Implémentez ici la logique pour enregistrer le restaurant dans votre base de données MSSQL
              // Assurez-vous de lier l'utilisateur et le restaurant en utilisant l'ID de l'utilisateur
      
              res.json({ "id": userId });
            } else {
              res.json({ "id": userId });
            } */
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
        const user = new User;
        
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

        // Paramters verification
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