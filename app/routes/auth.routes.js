const { verifySignUp, verifyLogin} = require("../middlewares");
const authController = require("../controllers/auth.controller");

module.exports = function(app) {
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkIfPresentAllSignUpDate,
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    app.post("/api/auth/login", [verifyLogin.checkIfPresentAllLoginDate()], authController.login);

    app.get("/api/auth/accessToken", authController.newAccessToken);

    app.get("/api/auth/logout", (req, res) => {
        res.clearCookie ( "refreshToken" );
        res.json ({ message : "Disconnected" });
    })
};