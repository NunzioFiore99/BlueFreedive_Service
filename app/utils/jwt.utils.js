const jwt = require('jsonwebtoken');

const getDecodedAccessToken = (req) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reject({ status: 403, message: "No token provided!" });
        }
        const accessToken = authHeader.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject({ status: 401, message: "Invalid token!" });
            }
            resolve(decoded);
        });
    });
};

module.exports = {
    getDecodedAccessToken,
};