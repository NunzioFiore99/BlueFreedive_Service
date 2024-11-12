const { authJwt } = require("../middlewares");
const userProfileController = require("../controllers/userProfile.controller");

module.exports = function(app) {
    app.get("/api/userProfiles/me", [authJwt.verifyAccessToken], userProfileController.retrieveSelf);
    app.put("/api/userProfiles/me", [authJwt.verifyAccessToken], userProfileController.updateSelf);
};