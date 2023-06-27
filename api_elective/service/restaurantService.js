/* 
 * The code containing the Restaurant related queries to the database.
 */

// Importing the associated connector
const connector = require("../connector/mongoConnector");




// Retrieving restaurant data by ID
module.exports.getById = function(id) {
    return Restaurant.findById(id);
};

// Retrieving multiple restaurant data by filter
module.exports.getAll = function(limit, offset, status) {
    let query = {};

    if (status) {
        query.status = { $in: status };
    }

    return Restaurant.find(query).limit(limit).skip(offset);
};