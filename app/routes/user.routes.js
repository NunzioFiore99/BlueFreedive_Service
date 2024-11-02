const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
    app.get("/api/test/all", userController.allAccess);

    app.get("/api/test/user", [authJwt.verifyAccessToken], userController.userBoard);

    app.get(
        "/api/test/admin",
        [authJwt.verifyAccessToken, authJwt.isAdmin],
        userController.adminBoard
    );
};