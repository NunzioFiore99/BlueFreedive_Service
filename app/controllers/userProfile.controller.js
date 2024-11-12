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
        if (req.body.gender) updates.gender = req.body.gender;
        if (req.body.birthdate) updates.birthdate = req.body.birthdate;
        if (req.body.firstName) updates.firstName = req.body.firstName;
        if (req.body.lastName) updates.lastName = req.body.lastName;
        if (req.body.weight) updates.weight = req.body.weight;
        if (req.body.height) updates.height = req.body.height;
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