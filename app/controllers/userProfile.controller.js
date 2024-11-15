const { getDecodedAccessToken } = require('../utils/jwt.utils');
const db = require("../models");
const { userProfile: UserProfile } = db;
const userProfileResponseDto = require("../contracts/userProfile.response.dto");

exports.retrieveSelf = async (req, res) => {
    try {
        const decodedAccessToken = await getDecodedAccessToken(req);
        const userId = decodedAccessToken.id;
        const userProfile = await UserProfile.findOne({user: userId});
        if (!userProfile) return res.status(404).json({ message: "User not found." });
        res.status(200).json(userProfileResponseDto(userProfile));
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
        const updates = {};
        updates.gender = req.body.gender;
        updates.birthdate = req.body.birthdate;
        updates.firstName = req.body.firstName;
        updates.lastName = req.body.lastName;
        updates.weight = req.body.weight;
        updates.height = req.body.height;
        const userId = decodedAccessToken.id;
        const updatedUserProfile = await UserProfile.findOneAndUpdate({user: userId}, updates, { new: true, runValidators: true, useFindAndModify: false });
        if (!updatedUserProfile) return res.status(404).json({ message: "User not found." });
        res.status(201).json(userProfileResponseDto(updatedUserProfile));
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};