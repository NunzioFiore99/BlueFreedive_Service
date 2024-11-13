const { authJwt } = require("../middlewares");
const diveSessionController = require("../controllers/diveSession.controller");

module.exports = function(app) {
    //Admin and User
    app.post("/api/diveSessions/me", [authJwt.verifyAccessToken], diveSessionController.createMyDiveSession);
    app.get("/api/diveSessions/me", [authJwt.verifyAccessToken], diveSessionController.retrieveMyDiveSessions);
    app.get("/api/diveSessions/me/:id", [authJwt.verifyAccessToken], diveSessionController.retrieveMyDiveSession);
    app.put("/api/diveSessions/me/:id", [authJwt.verifyAccessToken], diveSessionController.updateMyDiveSession);
    app.delete("/api/diveSessions/me/:id", [authJwt.verifyAccessToken], diveSessionController.deleteMyDiveSession);

    //Admin
    app.get("/api/diveSessions", [authJwt.verifyAccessToken, authJwt.isAdmin], diveSessionController.retrieveDiveSessions);
    app.get("/api/diveSessions/:id", [authJwt.verifyAccessToken, authJwt.isAdmin], diveSessionController.retrieveDiveSession);
    app.delete("/api/diveSessions/:id", [authJwt.verifyAccessToken, authJwt.isAdmin], diveSessionController.deleteDiveSession);
}