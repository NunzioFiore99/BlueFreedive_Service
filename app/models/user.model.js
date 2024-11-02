const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: [function() { return this.isNew; }, "Username is required"],
            unique: true,
            minlength: 3,
            maxlength: 20,
            match: /^[a-zA-Z0-9_]+$/ // Solo lettere, numeri e underscore
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+@.+\..+/ // RegEx di base per verificare che abbia un formato email
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;