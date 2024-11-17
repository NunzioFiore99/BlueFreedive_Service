const bcrypt = require("bcryptjs");
const { getDecodedAccessToken } = require('../utils/jwt.utils');
const userResponseDto = require("../contracts/user.response.dto");
const db = require("../models");
const { user: User, role: Role } = db;

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
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const user = await User.findOne({ _id: userId }).populate("roles", "-__v");
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(userResponseDto(user));
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.updateSelf = async (req, res) => {
    try {
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const updates = {};
        updates.email = req.body.email;
        updates.password = bcrypt.hashSync(req.body.password, 8);
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found." });
        res.status(204).send();
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.createUsers = async (req, res) => {
    try {
        const users = req.body;
        const savedUsers = [];
        for (let userData of users) {
            const user = new User({
                username: userData.username,
                email: userData.email,
                password: bcrypt.hashSync("Password", 8) //Hashed Password
            });
            user.roles = await getRoles(userData.roles);

            // Check if username already exist
            if (userData.username) {
                const existingUsername = await User.findOne({ username: userData.username });
                if (existingUsername) {
                    return res.status(400).json({ message: "Username already exists." });
                }
            }

            // Check if email already exist
            if (userData.email) {
                const existingEmail = await User.findOne({ email: userData.email });
                if (existingEmail) {
                    return res.status(400).json({ message: "Email already exists." });
                }
            }

            await user.save();
            const newUser = await User.findOne({ _id: user._id }).populate("roles");
            if(!newUser) return res.status(404).json({ message: "User not found." });
            savedUsers.push(userResponseDto(newUser));
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
            usersResponse.push(userResponseDto(user));
        });

        res.status(200).json(usersResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.retrieveUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate("roles", "-__v").exec();
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(userResponseDto(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if username already exist
        if (req.body.username && req.body.username !== user.username) {
            const existingUsername = await User.findOne({ username: req.body.username });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already exists." });
            }
        }

        // Check if email already exist
        if (req.body.email && req.body.email !== user.email) {
            const existingEmail = await User.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }

        const updates = {};
        updates.username = req.body.username;
        updates.email = req.body.email;
        if(req.body.password !== user.password) updates.password = bcrypt.hashSync(req.body.password, 8);
        updates.roles = await getRoles(req.body.roles);

        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, updates, { new: true, runValidators: true }).populate("roles", "-__v").exec();
        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        res.status(201).json(userResponseDto(updatedUser));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
        if (!deletedUser) return res.status(404).json({ message: "User not found." });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
