const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const { TokenExpiredError } = jwt;

const handleError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({ message: "Unauthorized! Access Token has expired!" });
    }
    return res.status(401).json({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return handleError(err, res);
        }
        req.userId = decoded.id;
        next();
    });
};

const checkRole = (roleName) => async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).populate("roles", "-__v").exec();

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const hasRole = user.roles.some(role => role.name === roleName);
        if (hasRole) {
            return next();
        }

        return res.status(403).json({ message: `Require ${roleName} Role!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Exporting middleware functions
const authJwt = {
    verifyToken,
    isAdmin: checkRole("admin"),
};

module.exports = authJwt;