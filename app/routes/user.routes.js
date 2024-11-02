const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", userController.allAccess);

    app.get("/api/test/user", [authJwt.verifyAccessToken], userController.userBoard);

    app.get(
        "/api/test/admin",
        [authJwt.verifyAccessToken, authJwt.isAdmin],
        userController.adminBoard
    );
};