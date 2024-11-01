const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

const checkRole = (roleName) => async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const hasRole = user.roles.some(role => role.name === roleName);
        if (hasRole) {
            next();
        } else {
            res.status(403).send({ message: `Require ${roleName} Role!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const authJwt = {
    verifyToken,
    isAdmin: checkRole("admin")
};
module.exports = authJwt;