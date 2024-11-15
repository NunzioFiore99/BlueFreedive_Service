const { verifySignUp, verifyLogin} = require("../middlewares");
const authController = require("../controllers/auth.controller");

module.exports = function(app) {
    /**
     * @swagger
     * /api/auth/signup:
     *   post:
     *     summary: User registration
     *     tags:
     *       - Auth
     *     description: Allows you to register a user on the system.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: The username for the new user
     *                 example: "username"
     *               email:
     *                 type: string
     *                 description: The email address of the user
     *                 example: "nome.cognome@example.com"
     *               password:
     *                 type: string
     *                 description: The password for the new user
     *                 example: "Password@123"
     *               roles:
     *                 type: array
     *                 description: List of roles for the new user
     *                 items:
     *                   type: string
     *                   enum:
     *                     - "ADMIN"
     *                     - "USER"
     *                 example: ["ADMIN", "USER"]
     *     responses:
     *       201:
     *         description: User registered successfully.
     *       500:
     *         description: Server error during user registration.
     */
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkIfPresentAllSignUpDate,
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: User access
     *     tags:
     *       - Auth
     *     description: Allows you to access a user on the system.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: The username for the new user
     *                 example: "username"
     *               password:
     *                 type: string
     *                 description: The password for the new user
     *                 example: "Password@123"
     *     responses:
     *       200:
     *         description: User access successfully.
     *         content:
     *           application/json:
     *             examples:
     *               success:
     *                 summary: Successful response
     *                 value:
     *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       401:
     *         description: User password is invalid.
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during user access.
     */
    app.post("/api/auth/login", [verifyLogin.checkIfPresentAllLoginDate], authController.login);

    /**
     * @swagger
     * /api/auth/accessToken:
     *   get:
     *     summary: New Access Token
     *     tags:
     *       - Auth
     *     description: Retrieve new Access Token if it is expired.
     *     parameters:
     *       - in: cookie
     *         name: refreshToken
     *         schema:
     *           type: string
     *         required: true
     *         description: The refresh token stored in the user's cookies.
     *         example: "2890d1ae-0558-40d6-ab49-5603a05b7bd7"
     *     responses:
     *       200:
     *         description: Retrieve new access token.
     *         content:
     *           application/json:
     *             examples:
     *               success:
     *                 summary: Successful response
     *                 value:
     *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       401:
     *         description: Refresh Token is required.
     *       500:
     *         description: Server error during retrieve access token.
     */
    app.get("/api/auth/accessToken", authController.newAccessToken);

    /**
     * @swagger
     * /api/auth/logout:
     *   get:
     *     summary: User logout
     *     tags:
     *       - Auth
     *     description: Remove refresh token from cookies.
     *     responses:
     *       200:
     *         description: Refresh token deleted.
     */
    app.get("/api/auth/logout", (req, res) => {
        res.clearCookie ( "refreshToken" );
        res.json ({ message : "Disconnected" });
    })
};