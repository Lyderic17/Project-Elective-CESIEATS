// Importing the Tedious components
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;  
const Types = require("tedious").TYPES;

// Importing the models
const User = require("../model/user");
const Address = require("../model/address");
const Billing = require("../model/billing");

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
// Create restaurant
module.exports.createRestaurant = function (restaurantData) {
    return new Promise((resolve, reject) => {
      const { name, userId, restaurantId } = restaurantData;
  console.log(restaurantData, 'hihih')
      // Vérifier que userId et restaurantId sont des nombres entiers valides
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(restaurantId) || restaurantId <= 0) {
        reject(new Error("Invalid userId or restaurantId"));
        return;
      }
  
      const query = 'INSERT INTO dbo.restaurants ("name", "userId") VALUES (@name, @userId); SELECT SCOPE_IDENTITY() AS "restaurantId";';
  
      const request = new Request(query, function (err, rowCount, rows) {
        try {
          if (err) throw err;
  
          if (rowCount <= 0) throw new ApiError("Statement returned no rows", 400);
  
          console.log("Request finished");
  
          const restaurantId = rows[0].restaurantId.value;
          console.log(restaurantId)
          resolve(restaurantId);
        } catch (err) {
          reject(err);
        }
      });
  
      // Ajouter les paramètres de requête
      request.addParameter("name", Types.VarChar, name);
      request.addParameter("userId", Types.Int, userId);
  
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
    SELECT SCOPE_IDENTITY() AS "userId";
    `;

    const request = new Request(query, function (err, rowCount, rows) {
      try {
        if (err) throw err;

        if (rowCount <= 0) throw new ApiError("Statement returned no rows", 400);

        console.log("Request finished");

        const userId = rows[0].userId; // Accès direct à la valeur de la colonne sans utiliser .value
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
        
        if (user.usertype || user.usertype === 0) {
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

// Creates an User object from SQL data
deserializeUser = function(rows) {
    const user = new User;
    
    const firstRow = rows[0];
    const userAddresses = [];   // Workaround to prevent the inclusion of data twice
    const userBillings = [];    // Workaround to prevent the inclusion of data twice

    // Single attributes
    user.id = firstRow[0].value;
    user.username = firstRow[1].value;
    user.usertype = firstRow[2].value;
    user.email = firstRow[3].value;
    user.password = firstRow[4].value;
    user.firstname = firstRow[5].value ? firstRow[5].value : null;
    user.lastname = firstRow[6].value ? firstRow[6].value : null;

  
    
    return user;
};

// Trigger connection
connection.connect();
