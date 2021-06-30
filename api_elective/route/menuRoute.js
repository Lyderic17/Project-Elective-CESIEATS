/* 
 * The code containing the routes for the Menu endpoint.
 * Author	: Rubisetcie
 */

const router = require("express").Router();

// Importing the associated controller
const controller = require("../controller/menuController");

// Retrieving multiple menu data by filter
router.get('/', controller.getAll);

// Retrieving multiple menu data by restaurant ID
router.get('/restaurant/:id', controller.getByRestaurantId);

// Retrieving menu data by ID
router.get('/:id', controller.getById);

module.exports = router;