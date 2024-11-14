const { authJwt, validateRequestParam } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
    //Admin and User
    app.get("/api/users/me", [authJwt.verifyAccessToken], userController.retrieveSelf)
    app.patch("/api/users/me", [authJwt.verifyAccessToken], userController.updateSelf)

    //Admin
    app.post("/api/users", [authJwt.verifyAccessToken, authJwt.isAdmin], userController.createUsers);
    app.get("/api/users", [authJwt.verifyAccessToken, authJwt.isAdmin], userController.retrieveUsers)
    app.get("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.retrieveUser)
    app.put("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.updateUser);
    app.delete("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.deleteUser);
};