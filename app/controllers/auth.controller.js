const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400 // 24 hours
    });
};

// Get user roles
const getRoles = async (rolesArray) => {
    if (rolesArray) {
        const roles = await Role.find({ name: { $in: rolesArray } });
        return roles.map(role => role._id);
    } else {
        const userRole = await Role.findOne({ name: "user" });
        return [userRole._id];
    }
};

// Signup
exports.signup = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        user.roles = await getRoles(req.body.roles);
        await user.save();

        res.send({ message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
            .populate("roles", "-__v")
            .exec();

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
        }

        const token = generateToken(user.id);
        const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
