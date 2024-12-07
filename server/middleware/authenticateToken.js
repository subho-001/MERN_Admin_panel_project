const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next)=>{
    const token = req.header('Authorization')?.split(' ')[1]; // Extract the JWT token from the Authorization header in the HTTP request.

    if(!token) {
        return res.status(401).json({error:true, message:"Access Denied"})//checks if the token is missing.
    }

    try{
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)// Attempts to verify the token using the jwt.verify() method.
        req.user = verifiedToken;// Attaches the decoded token data to the req.user property.
        next(); //if the token is valid, next() is called to move the request to the next middleware or route handler.
    } catch(err) {
        res.status(403).json({error:true, message:"Invalid Token"})
    }
    // console.log(token);
}

module.exports = authenticateToken


