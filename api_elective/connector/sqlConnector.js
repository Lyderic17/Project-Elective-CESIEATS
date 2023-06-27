// Importing the Tedious components
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;  
const Types = require("tedious").TYPES;

// Importing the models
const User = require("../model/user");
const Address = require("../model/address");
const Billing = require("../model/billing");
const Restaurant = require('../model/restaurant')
// Importing the ApiError exception class
const ApiError = require("../exception/apiError");

// Connection constants
const HOST = process.env.SQL_HOST || "PC-LYDERIC";
const USERNAME = 'SQL-Lyderic';
const PASSWORD = "Lyd170701";

// Options for the connection
const config = {
    server: HOST,
    authentication: {
        type: "default",    
        options: {
            userName: USERNAME,
            password: PASSWORD
        }
    },
    options: {
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        database: "projet_elective",
        trustServerCertificate: true,
        integratedSecurity: true,
    }
};

const connection = new Connection(config);

// Callback when connected
connection.on("connect", function(err) {
    if (err) {
        console.error("Error while connecting to Microsoft SQL Database", err);
    } else {
        console.log("Connected to Microsoft SQL Database");
    }
});

// Select restaurant by ID
module.exports.selectRestaurantById = function(id) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT restaurant_ID AS "id", owner_ID, rest_name, address, phone, crea_date, rating, status FROM restaurants WHERE restaurant_ID = @id';

      const request = new Request(query, function(err, rowCount, rows) {
          try {
              if (err)
                  throw err;
              
              if (rowCount <= 0)
                  throw new ApiError("Query returned no rows", 400);

              const restaurant = deserializeRestaurant(rows);

              console.log(rowCount + " rows returned");

              resolve(restaurant);
          } catch (err) {
              reject(err);
          }
      });
      
      // Request parameters
      request.addParameter("id", Types.Int, id);

      connection.execSql(request);
  });
};

// Create restaurant// Create restaurant
module.exports.createRestaurant = function(restaurant) {
  return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO dbo.restaurants ("owner_ID", "rest_name", "address", "phone", "crea_date", "rating", "status")
      VALUES (@owner_ID, @rest_name, @address, @phone, @crea_date, @rating, @status);
      SELECT SCOPE_IDENTITY() AS "restaurant_ID";
      `;

      const request = new Request(query, function (err, rowCount, rows) {
          try {
              if (err) throw err;

              if (rowCount <= 0) throw new ApiError("Statement returned no rows", 400);

              console.log("Request finished");

              const restaurantId = rows[0].restaurant_ID.value;
              resolve(restaurantId);
          } catch (err) {
              reject(err);
          }
      });

      // Request parameters
      request.addParameter("owner_ID", Types.Int, restaurant.owner_ID);
      request.addParameter("rest_name", Types.VarChar, restaurant.rest_name);
      request.addParameter("address", Types.VarChar, restaurant.address);
      request.addParameter("phone", Types.VarChar, restaurant.phone);
      request.addParameter("crea_date", Types.DateTime, restaurant.crea_date);
      request.addParameter("rating", Types.Float, restaurant.rating);
      request.addParameter("status", Types.VarChar, restaurant.status);

      connection.execSql(request);
  });
};
  
  
// Select user by ID
module.exports.selectUserById = function(id) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT user_ID AS "id", name, lastname, mail, password, phone, referer, nb_referer, role, rating, address, crea_date FROM users WHERE user_ID = @id';

      const request = new Request(query, function(err, rowCount, rows) {
          try {
              if (err)
                  throw err;
              
              if (rowCount <= 0)
                  throw new ApiError("Query returned no rows", 400);

              const user = deserializeUser(rows);

              console.log(rowCount + " rows returned");

              resolve(user);
          } catch (err) {
              reject(err);
          }
      });
      
      // Request parameters
      request.addParameter("id", Types.Int, id);

      connection.execSql(request);
  });
};


// Select user by email// Select user by email
module.exports.selectOneUser = function(email) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT user_ID AS "id", name, lastname, mail, password, phone, referer, nb_referer, role, rating, address, crea_date FROM users WHERE mail LIKE @email';

      const request = new Request(query, function(err, rowCount, rows) {
          try {
              if (err)
                  throw err;
              
              if (rowCount <= 0)
                  throw new ApiError("Query returned no rows", 400);

              const user = deserializeUser(rows);

              console.log(rowCount + " rows returned");

              // Vérification du rôle de l'utilisateur
              /* if (user.role !== "5") {
                  // Si le rôle n'est pas "5" (User), l'utilisateur n'a pas le rôle attendu
                  throw new ApiError("Unauthorized access", 403);
              } */

              resolve(user);
          } catch (err) {
              reject(err);
          }
      });
      
      // Request parameters
      request.addParameter("email", Types.VarChar, email ? email : "%");

      connection.execSql(request);
  });
};


module.exports.insertUser = function(user) {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO dbo.users ("name", "lastname", "mail", "password", "phone", "referer", "nb_referer", "role", "rating", "address", "crea_date")
    VALUES (@name, @lastname, @mail, @password, @phone, @referer, @nb_referer, @role, @rating, @address, @crea_date);
    SELECT SCOPE_IDENTITY() AS "user_ID";
    `;

    const request = new Request(query, function (err, rowCount, rows) {
      try {
        if (err) throw err;

        if (rowCount <= 0) throw new ApiError("Statement returned no rows", 400);

        console.log("Request finished");

        const userId = rows[0].user_ID; // Accès direct à la valeur de la colonne sans utiliser .value
        resolve(userId);
      } catch (err) {
        reject(err);
      }
    });

    // Request parameters
    request.addParameter("name", Types.VarChar, user.name);
    request.addParameter("lastname", Types.VarChar, user.lastname);
    request.addParameter("mail", Types.VarChar, user.mail);
    request.addParameter("password", Types.VarChar, user.password);
    request.addParameter("phone", Types.Int, user.phone);
    request.addParameter("referer", Types.Int, user.referer);
    request.addParameter("nb_referer", Types.Int, user.nb_referer);
    request.addParameter("role", Types.VarChar, user.role);
    request.addParameter("rating", Types.Float, user.rating);
    request.addParameter("address", Types.Text, user.address);
    request.addParameter("crea_date", Types.DateTime, user.crea_date);

    connection.execSql(request);
  });
};

  

// Update user
module.exports.updateUser = function(user) {
    return new Promise((resolve, reject) => {
        var statement = 'UPDATE dbo.users';
        var set = 0;
        
        // Set the columns
        if (user.username) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "username" = @username';
            set++;
        }
        
        if (user.role || user.role === 0) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "usertype" = @usertype';
            set++;
        }
        
        if (user.email) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "email" = @email';
            set++;
        }
        
        if (user.password) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "password" = @password';
            set++;
        }

        if (user.firstname) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "firstname" = @firstname';
            set++;
        }
        
        if (user.lastname) {
            if (set === 0)  statement += ' SET';
            statement += (set > 0 ? ',' : '') + ' "lastname" = @lastname';
            set++;
        }
            
        statement += ' WHERE dbo.users.id = @id;';

        const request = new Request(statement, function(err) {
            try {
                if (err)
                    throw err;
                
                console.log("Request finished");

                resolve();
            } catch (err) {
                reject(err);
            }
        });
        
        // Request parameters
        request.addParameter("id", Types.BigInt, user.id);
        request.addParameter("username", Types.VarChar, user.username);
        request.addParameter("usertype", Types.TinyInt, user.usertype);
        request.addParameter("email", Types.VarChar, user.email);
        request.addParameter("password", Types.VarChar, user.password);
        request.addParameter("firstname", Types.VarChar, user.firstname);
        request.addParameter("lastname", Types.VarChar, user.lastname);

        connection.execSql(request);
    });
};

// Creates a Restaurant object from SQL data
deserializeRestaurant = function(rows) {
  const restaurant = new Restaurant;

  const firstRow = rows[0];

  // Unique attributes
  restaurant.restaurant_ID = firstRow[0].value;
  restaurant.owner_ID = firstRow[1].value;
  restaurant.rest_name = firstRow[2].value;
  restaurant.address = firstRow[3].value;
  restaurant.phone = firstRow[4].value;
  restaurant.crea_date = firstRow[5].value;
  restaurant.rating = firstRow[6].value ? firstRow[6].value : null;
  restaurant.status = firstRow[7].value;

  return restaurant;
};
// Creates an User object from SQL data
// Crée un objet User à partir des données SQL
deserializeUser = function(rows) {
  const user = new User;

  const firstRow = rows[0];

  // Attributs uniques
  user.user_ID = firstRow[0].value;
  user.name = firstRow[1].value;
  user.lastname = firstRow[2].value;
  user.mail = firstRow[3].value;
  user.password = firstRow[4].value;
  user.phone = firstRow[5].value;
  user.referer = firstRow[6].value ? firstRow[6].value : null;
  user.nb_referer = firstRow[7].value ? firstRow[7].value : null;
  user.role = firstRow[8].value;
  user.rating = firstRow[9].value ? firstRow[9].value : null;
  user.address = firstRow[10].value;
  user.crea_date = firstRow[11].value;

  return user;
};

// Select all restaurants
module.exports.selectAllRestaurants = function(offset, limit) {
  return new Promise((resolve, reject) => {
    // Convert offset and limit to integers, provide default values if they are not defined or not a number
    offset = Number.isInteger(parseInt(offset)) ? parseInt(offset) : 0;
    limit = Number.isInteger(parseInt(limit)) ? parseInt(limit) : 100; // or any other default limit you want to set

    const query = 'SELECT restaurant_ID AS "id", owner_ID, rest_name, address, phone, crea_date, rating, status FROM restaurants ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';

    const request = new Request(query, function(err, rowCount, rows) {
        try {
            if (err)
                throw err;

            if (rowCount <= 0)
                throw new ApiError("Query returned no rows", 400);

            const restaurants = rows.map(row => deserializeRestaurant(row));

            console.log(rowCount + " rows returned");

            resolve(restaurants);
        } catch (err) {
            reject(err);
        }
    });

    // Request parameters
    request.addParameter("offset", Types.Int, offset);
    request.addParameter("limit", Types.Int, limit);

    connection.execSql(request);
  });
};

// Creates an Restaurant object from SQL data
// Crée un objet Restaurant à partir des données SQL
deserializeRestaurant = function(row) {
  const restaurant = new Restaurant;

  // Attributs uniques
  restaurant.restaurant_ID = row[0].value;
  restaurant.name = row[1].value;
  // Add other restaurant attributes here based on your model
  
  return restaurant;
};

// Trigger connection
connection.connect();
