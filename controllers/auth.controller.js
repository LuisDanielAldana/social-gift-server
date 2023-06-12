const jwt = require('jsonwebtoken');
const config = require("../config").configuration

function generateJWT(username) {
    return jwt.sign(username, "091909e0e3f828bdec58a9491f1e78d01cf9c62c6f2973b89c85be6acca429da38119d62855650554854d0d537ad6f114864d750bbb1da3ffe4d87e6c2f1e268");
}

async function validateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    let authToken;

    if(authHeader && authHeader.length){
        const tokenParts = authHeader.split(' ');
        if(tokenParts.length == 2){
            authToken = tokenParts[1];
        }
    }
    try{
        await jwt.verify(authToken, "091909e0e3f828bdec58a9491f1e78d01cf9c62c6f2973b89c85be6acca429da38119d62855650554854d0d537ad6f114864d750bbb1da3ffe4d87e6c2f1e268");
        next()
        ;    } catch (e){
        res.status(401).json({
            message: "UNAUTHORIZED"
        })
    }
}


module.exports = {
    generateJWT,
    validateJWT
}
