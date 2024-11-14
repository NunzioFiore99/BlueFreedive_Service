const mongoose = require('mongoose');

const diveSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    location: {
        type: String,
        maxlength: 100
    },
    gpsCoordinates: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    waterType: {
        type: String,
        enum: ["SEA", "LAKE"],
        required: true
    },
    temperature: {
        type: Number
    },
    diveCount: {
        type: Number,
        required: true,
        min: 1
    },
    maxDepth: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiveTime: {
        type: Number,
        required: true,
        min: 0 //Seconds
    },
    notes: {
        type: String,
        maxlength: 1000
    }
});

const DiveSession = mongoose.model("dive_sessions", diveSessionSchema);

module.exports = DiveSession;