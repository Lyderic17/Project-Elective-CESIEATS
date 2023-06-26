
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcryptjs");

    // Importing the associated service
    const service = require("../service/authenticationService");

    // Importing the utils functions
    const handleError = require("../utils/apiUtils").handleError;

    // Importing the ApiError exception class
    const ApiError = require("../exception/apiError");

    // Authentication constants
    const ACCESSTOKENSECRET = process.env.AUTH_ACCESSTOKENSECRET || "secret";
    const REFRESHTOKENSECRET = process.env.AUTH_REFRESHTOKENSECRET || "secretRefresh";
    const TOKENEXPIRATION = process.env.AUTH_TOKENEXPIRATION || "20m";

    var refreshTokens = [];

    // Trigger user login
    module.exports.login = function(req, res) {
        try {
            // Parameters reading
            if (!req.body)
                throw new ApiError("Request body is undefined", 400);
            
            const email = req.body["email"];
            const password = req.body["password"];

            // Paramters verification
            if (!email)     throw new ApiError("Missing mandatory parameter: email", 400);
            if (!password)  throw new ApiError("Missing mandatory parameter: password", 400);
            
            service.getUserByEmail(email).then(async function(user) {
                if(!user){
                    return res.status(404).send("User not found");
                }
            
                const validPassword = await bcrypt.compare(password, user.password);
            
                if (!validPassword) {
                    return res.status(400).send("Password mismatch");
                }
            
                // Access token generation
                const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    role: user.usertype
                }, process.env.AUTH_ACCESSTOKENSECRET || "secret", { expiresIn: process.env.AUTH_TOKENEXPIRATION || "20m" });
                
                // Refresh token generation
                const refreshToken = jwt.sign(
                    {
                      id: user.id,
                      username: user.username,
                      role: user.usertype,
                    },
                    REFRESHTOKENSECRET,
                    { expiresIn: '7d' }
                  );
                
                refreshTokens.push(refreshToken);
                
                return res.json({ accessToken, refreshToken, user });
            
            }).catch((error) => {
                return handleError(error, res, "logging in");
            });
        } catch (err) {
            handleError(err, res, "logging in");
        }
    };

    // Trigger user logout
    module.exports.logout = function(req, res) {
        try {
            // Parameters reading
            if (!req.body)
                throw new ApiError("Request body is undefined", 400);
            
            const token = req.body["token"];
            
            // Paramters verification
            if (!token)
                throw new ApiError("Missing mandatory parameter: token", 401);
            
            refreshTokens = refreshTokens.filter((t) => { t !== token; });

            res.status(204).send();
        } catch (err) {
            handleError(err, res, "logging out");
        }
    };

    // Generates new tokens based on the refresh tokens
    module.exports.token = function(req, res) {
        try {
            // Parameters reading
            if (!req.body)
                throw new ApiError("Request body is undefined", 400);
            
            const token = req.body["token"];

            // Paramters verification
            if (!token)
                throw new ApiError("Missing mandatory parameter: token", 401);
            
            // Check if the token is contained in the generated refresh token list
            if (!refreshTokens.includes(token))
                throw new ApiError("Wrong refresh token", 403);
            
            jwt.verify(token, REFRESHTOKENSECRET, (err, user) => {
                if (err)
                    throw new ApiError("Wrong refresh token", 403);

                const accessToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    role: user.usertype
                }, ACCESSTOKENSECRET || "secret", { expiresIn: TOKENEXPIRATION || "20m" });

                res.json({ accessToken });
            });
        } catch (err) {
            handleError(err, res, "refreshing token");
        }
    };

    // Middleware that handles authentication using JWT
    module.exports.authentication = function(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            console.log(authHeader, 'authHeader')
            if (authHeader) {
                const bearer = authHeader.split(' ')[1];
                jwt.verify(bearer, ACCESSTOKENSECRET || "secret", (err, token) => {
                    if (err)
                        throw new ApiError("Wrong access token", 403);

                    // Passing the token to the request
                    req.token = token;
                    
                    // Continuing the route
                    next();
                });
            } else {
            throw new ApiError("An authorization is required for this request", 401);
            }
        } catch (err) {
            console.error("Authentication error:", err);
            res.status(err instanceof ApiError ? err.code : 500).send(err.message);
        }
    };