const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkIfPresentAllSignUpDate = (req, res, next) => {
    if(!req.body.username) return res.status(400).send({ message: "Username not present." });
    if(!req.body.email) return res.status(400).send({ message: "Email not present." });
    if(!req.body.password) return res.status(400).send({ message: "Password not present." });
    if(!req.body.roles || req.body.roles.length === 0) return res.status(400).send({ message: "Roles not present." });
    next();
}

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({ username: req.body.username });
        if (userByUsername) {
            return res.status(400).send({ message: "Failed! Username is already in use!" });
        }

        const userByEmail = await User.findOne({ email: req.body.email });
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
    checkIfPresentAllSignUpDate,
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;