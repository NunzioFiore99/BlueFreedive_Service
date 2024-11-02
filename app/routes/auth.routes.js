const { verifySignUp } = require("../middlewares");
const authController = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    app.post("/api/auth/login", authController.login);

    app.get("/api/auth/accesstoken", authController.newAccessToken());

    app.get("/logout", (req, res) => {
        res. clearCookie ( "token" );
        res. json ({ message : "Disconnected" });
    })
};