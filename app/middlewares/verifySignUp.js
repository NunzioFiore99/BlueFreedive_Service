const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const [userByUsername, userByEmail] = await Promise.all([
            User.findOne({ username: req.body.username }).exec(),
            User.findOne({ email: req.body.email }).exec(),
        ]);

        if (userByUsername) {
            return res.status(400).send({ message: "Failed! Username is already in use!" });
        }

        if (userByEmail) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        const invalidRoles = req.body.roles.filter(role => !ROLES.includes(role));
        if (invalidRoles.length > 0) {
            return res.status(400).send({
                message: `Failed! Role(s) ${invalidRoles.join(", ")} does not exist!`
            });
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;