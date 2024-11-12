const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    expiryDate: { type: Date, required: true }
});

refreshTokenSchema.statics.createToken = async function (user) {
    try {
        const expiryDate = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRATION) * 1000); // Use milliseconds
        const token = uuidv4();

        const refreshToken = new this({
            token,
            user: user._id,
            expiryDate,
        });

        await refreshToken.save();
        return refreshToken.token;
    } catch (error) {
        console.error("Error creating refresh token:", error);
        throw new Error("Could not create refresh token");
    }
};

refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate < new Date();
}

const RefreshToken = mongoose.model("refresh_tokens", refreshTokenSchema);

module.exports = RefreshToken;