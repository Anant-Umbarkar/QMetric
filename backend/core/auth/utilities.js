const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config(); 

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; 
    const token = authHeader && authHeader.split(" ")[1];

    // No token, unauthorized
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { 
        // Token invalid, forbidden
        if (err) return res.sendStatus(403); // Use 403 Forbidden for invalid token
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
