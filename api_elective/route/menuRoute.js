

const router = require("express").Router();

// Importing the associated controller
const controller = require("../controller/menuController");

// Retrieving multiple menu data by filter
router.get("/", controller.getAll);

// Retrieving multiple menu data by restaurant ID
router.get("/restaurant/:id", controller.getByRestaurantId);
router.get("/byUser/:userId", controller.getByUserId);
// Récupérer tous les menus créés par un restaurateur
router.get("/restaurateur/:restaurateurId", controller.getMenusByRestaurateurId);

// Retrieving menu data by ID
router.get("/:id", controller.getById);
// Create a new menu
router.post("/", controller.createMenu);

module.exports = router;