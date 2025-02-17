const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer")) {
        const token = authorization.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: "Unauthorized, Invalid token!" });
            }
            
            req.user = {
                id: decoded.id,
                fullname: decoded.fullname,
                email: decoded.email,
            };



            next();
        });
    } else {
        return res.status(401).json({ message: "Unauthorized. No token!" });
    }
};

module.exports = auth;
