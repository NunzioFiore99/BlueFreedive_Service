const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const handleError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({ message: "Unauthorized! Access Token has expired!" });
    }
    return res.status(401).json({ message: "Unauthorized!" });
}

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return handleError(err, res);
        }

        if (decoded.roles) {
            req.userRoles = decoded.roles;
        }

        next();
    });
};

const checkRole = (roleName) => async (req, res, next) => {
    try {
        if (!req.userRoles) {
            return res.status(403).json({ message: `Require ${roleName} Role!` });
        }

        const hasRole = req.userRoles.includes("ROLE_" + roleName.toUpperCase());
        if (hasRole) {
            return next();
        }

        return res.status(403).json({ message: `Require ${roleName} Role!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Exporting auth middleware functions
const authJwt = {
    verifyAccessToken,
    isAdmin: checkRole("ADMIN"),
};

module.exports = authJwt;