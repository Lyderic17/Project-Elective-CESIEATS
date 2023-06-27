const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const mongoose = require('mongoose');
const Restaurant = require('./model/restaurant');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("yamljs").load("./swagger/swagger.yaml");

const app = express();
const corsOptions = {
    origin: 'http://localhost:8080', 
    credentials: true
  };
const server = require('http').createServer(app);
const websocket = require('../websocket');

require("dotenv").config();

// Port number
const PORT = process.env.PORT || 3000;

    // Importing the different routes for every endpoint
    const userRouter = require("./route/userRoute");
    const restaurantRouter = require("./route/restaurantRoute");
    const menuRouter = require("./route/menuRoute");
    const orderRouter = require("./route/orderRoute");
    const userController = require("./controller/userController");
    const authenticationController = require("./controller/authenticationController");
    const clientRoute = require("./route/ClientRoute");
    const restaurantController = require('./controller/restaurantController')

    // Options for the documentation
    const swaggerOptions = {
        explorer: false
    };

    app.use(bodyParser.json());
    app.use(cors(corsOptions));

    // Documentation URL
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

    // Logging middleware
    app.use(morgan("common", {stream: fs.createWriteStream(__dirname + "/access.log", { flags: "a" })}));

app.post("/restaurants/create", restaurantController.createRestaurant);
    // Login URL
    app.post("/login", authenticationController.login);
    app.post("/logout", authenticationController.logout);
    app.post("/token", authenticationController.token);

    // Add the route to create a new user before the authentication middleware
    app.post("/user/", userController.post);

    // Authentication handling for the API
    app.use(authenticationController.authentication);

    app.use("/user", userRouter);
    app.use("/restaurant", restaurantRouter);
    app.use("/menu", menuRouter);
    app.use("/order", orderRouter);
    app.use("/client", clientRoute);

// Connection constants         si vous voulez hack la bdd :  prendre cette ligne -->       "mongodb+srv://lyderic1:************@cluster0corbeille.j2rawlj.mongodb.net/?retryWrites=true&w=majority"
const HOST = process.env.MONGO_HOST || "mongodb+srv://lyderic1:JbL86LYjSuPkSAoQ@cluster0corbeille.j2rawlj.mongodb.net/?retryWrites=true&w=majority";
const DATABASE = process.env.MONGO_DATABASE || "Elective";
/* const initialRestaurants = [
    {
      name: "Restaurant 1",
      address: {
        country: "Country 1",
        zipcode: "12345",
        city: "City 1",
        address: "Address 1"
      },
      status: "Open",
      image: {
        url: "https://media.istockphoto.com/id/1081422898/fr/photo/po%C3%AAl%C3%A9e-de-canard.jpg?s=612x612&w=0&k=20&c=CwIhZIZ5vyDtwhps3RmqRC2Mo5TADdyvhoS84dkWhSI=",
        alt: "Image 1"
      },
      openings: [
        { open: "09:00", close: "18:00" },
        { open: "19:00", close: "22:00" }
      ],
      tags: ["Italian", "Cafe"],
      description: "Description 1"
    },
    // Ajoutez d'autres restaurants initiaux ici...
  ]; */
  
  // Insérer les restaurants initiaux dans la collection
/*   Restaurant.insertMany(initialRestaurants)
    .then(() => {
      console.log("Initial restaurants inserted successfully");
    })
    .catch((error) => {
      console.error("Error inserting initial restaurants:", error);
    }); */
/// Connect to MongoDB
mongoose.connect(`${HOST}/${DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority'
    }
}).then(() => {
    console.log('Connected to MongoDB');

    // Vérifier l'état de la connexion MongoDB
    if (mongoose.connection.readyState === 1) {
        console.log('Connecté à MongoDBBBBBBBBBBB');
    } else {
        console.log('Déconnecté de MongoDB');
    }

    // Start listening only after MongoDB connection is established
    server.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });

    websocket.startWebSocketServer(server);
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});