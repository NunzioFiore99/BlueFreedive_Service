const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { user: User, role: Role } = db;

const getDecodedAccessToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reject(res.status(403).json({ message: "No token provided!" }));
        }
        const accessToken = authHeader.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(res.status(401).json({ message: "Invalid token!" }));
            }
            resolve(decoded);
        });
    });
};

const getRoles = async (rolesArray) => {
    if (rolesArray) {
        const roles = await Role.find({ name: { $in: rolesArray } });
        return roles.map(role => role._id);
    } else {
        const userRole = await Role.findOne({ name: "user" });
        return [userRole._id];
    }
};

exports.retrieveSelf = async (req, res) => {
    try {
        const decodedAccessToken = await getDecodedAccessToken(req, res);
        const userId = decodedAccessToken.id;
        const user = await User.findById(userId).populate("roles", "-__v");
        if (!user) return res.status(404).json({ message: "User not found." });
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.__v;

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSelf = async (req, res) => {
    try {
        const decodedAccessToken = await getDecodedAccessToken(req, res);
        const updates = {};
        if (req.body.email) updates.email = req.body.email;
        if (req.body.password) updates.password = bcrypt.hashSync(req.body.password, 8);
        const userId = decodedAccessToken.id;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found." });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUsers = async (req, res) => {
    try {
        const users = req.body;
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).send({ message: "No users provided!" });
        }
        const userResponse = {
            id: String,
            username: String,
            email: String,
            roles: []
        };
        const savedUsers = [];
        for (let userData of users) {
            const hashedPassword = bcrypt.hashSync("Password", 8);
            const user = new User({
                username: userData.username,
                email: userData.email,
                password: hashedPassword
            });

            user.roles = await getRoles(userData.roles);

            const savedUser = await user.save();
            userResponse.id = savedUser.id;
            userResponse.username = savedUser.username;
            userResponse.email = savedUser.email;
            userResponse.roles = userData.roles;
            savedUsers.push(userResponse);
        }

        res.status(201).send({ message: "Users registered successfully!", users: savedUsers });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.retrieveUsers = async (req, res) => {
    try {
        const users = await User.find().populate("roles", "-__v");
        const usersResponse = [];

        users.forEach((user) => {
            const userResponse = {
                id: String(user._id),
                username: user.username,
                email: user.email,
                roles: user.roles,
            };
            usersResponse.push(userResponse);
        });

        res.status(200).json(usersResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.retrieveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("roles", "-__v").exec();
        if (!user) return res.status(404).json({ message: "User not found." });
        const userResponse = {
            id: String,
            username: String,
            email: String,
            roles: []
        };
        userResponse.id = user._id;
        userResponse.username = user.username;
        userResponse.email = user.email;
        userResponse.roles = user.roles;
        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updates = {};
        if (req.body.username) updates.username = req.body.username;
        if (req.body.email) updates.email = req.body.email;
        if (req.body.password) updates.password = bcrypt.hashSync(req.body.password, 8);
        if (req.body.roles) updates.roles = await getRoles(req.body.roles);

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("roles", "-__v").exec();
        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        const userResponse = {
            id: String,
            username: String,
            email: String,
            roles: []
        };
        userResponse.id = updatedUser._id;
        userResponse.username = updatedUser.username;
        userResponse.email = updatedUser.email;
        userResponse.roles = updatedUser.roles;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found." });
        res.status(200).json({ message: "User deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
