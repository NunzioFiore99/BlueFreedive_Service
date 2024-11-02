const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles.map(role => "ROLE_" + role.name.toUpperCase())
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
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

        res.send({ message: "You have registered successfully!" });
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

        const accessToken = generateToken(user);
        const refreshToken = await RefreshToken.createToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Non accessibile tramite JavaScript (attacchi XSS)
            secure: false, // Non uso HTTPS ma HTTP
            sameSite: 'Strict', // Impedisce l'invio del cookie in contesti cross-site (CSRF Token)
            maxAge: process.env.JWT_REFRESH_EXPIRATION * 1000 //Tempo di scadenza pari a quello di validità del refresh token
        });

        res.status(200).send({
            accessToken: accessToken
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Get new access_token and check refresh_token
exports.newAccessToken = async (req, res) => {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
        return res.status(401).json({ message: "Refresh Token is required. Please make a new login request." });
    }

    try {
        const refreshTokenInDb = await RefreshToken.findOne({ token: refreshTokenCookie }).populate({
            path: 'user',
            populate: {
                path: 'roles',
                select: '-__v'
            }
        }).exec();
        if (!refreshTokenInDb) {
            return res.status(401).json({ message: "Refresh token is not in database!" });
        }
        if (RefreshToken.verifyExpiration(refreshTokenInDb)) {
            await RefreshToken.findByIdAndDelete(refreshTokenInDb._id);
            return res.status(401).json({ message: "Refresh token was expired. Please make a new login request." });
        }

        const newAccessToken = generateToken(refreshTokenInDb.user);
        return res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};
