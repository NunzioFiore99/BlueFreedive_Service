const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.userProfile = require("./userProfile.model");
db.refreshToken = require("./refreshToken.model");
db.diveSession = require("./diveSession.model");

db.ROLES = ["ADMIN", "USER"];

module.exports = db;