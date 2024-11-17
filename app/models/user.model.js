const mongoose = require("mongoose");
const UserProfile = require("../models/userProfile.model");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [function() { return this.isNew; }, "Username is required"],
        unique: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roles"
        }
    ]
});

// Hook for new UserProfile
userSchema.post("save", async function(doc, next) {
    try {
        await UserProfile.create({
            user: doc._id,
            gender: "MALE",
            birthdate: null,
            firstName: "FirstName",
            lastName: "LastName",
            weight: 0,
            height: 0
        });
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;