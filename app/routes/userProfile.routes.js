const { authJwt } = require("../middlewares");
const userProfileController = require("../controllers/userProfile.controller");

module.exports = function(app) {
    /**
     * @swagger
     * /api/userProfiles/me:
     *   get:
     *     summary: Retrieve user profile
     *     tags:
     *       - User Profile
     *     description: Retrieve user profile data by user in jwt token.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *     responses:
     *       200:
     *         description: Retrieve user profile data.
     *         content:
     *           application/json:
     *             examples:
     *               success:
     *                 summary: Successful response
     *                 value:
     *                   id: "6733b9cc83a4f6916c12c821"
     *                   userId: "6733b9cc83a458416c12c821"
     *                   gender: "MALE"
     *                   birthdate: "1999-08-20"
     *                   firstName: "Mario"
     *                   lastName: "Rossi"
     *                   weight: 90
     *                   height: 170
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during retrieve user profile data.
     */
    app.get("/api/userProfiles/me", [authJwt.verifyAccessToken], userProfileController.retrieveSelf);

    /**
     * @swagger
     * /api/userProfiles/me:
     *   put:
     *     summary: Update user profile
     *     tags:
     *       - User Profile
     *     description: Update user profile data by user in jwt token.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               gender:
     *                 type: string
     *                 description: User gender
     *                 items:
     *                   type: string
     *                   enum:
     *                     - "MALE"
     *                     - "FEMALE"
     *                 example: "MALE"
     *               birthdate:
     *                 type: date
     *                 description: User birthday
     *                 example: "1999-08-20"
     *               firstName:
     *                 type: string
     *                 description: User firstname
     *                 example: "Mario"
     *               lastName:
     *                 type: string
     *                 description: User lastname
     *                 example: "Rossi"
     *               weight:
     *                 type: number
     *                 description: User weight (kg)
     *                 example: "90"
     *               height:
     *                 type: number
     *                 description: User height (cm)
     *                 example: "170"
     *     responses:
     *       201:
     *         description: Update user profile data.
     *         content:
     *           application/json:
     *             examples:
     *               success:
     *                 summary: Successful response
     *                 value:
     *                   id: "6733b9cc83a4f6916c12c821"
     *                   userId: "6733b9cc83a458416c12c821"
     *                   gender: "MALE"
     *                   birthdate: "1999-08-20"
     *                   firstName: "Mario"
     *                   lastName: "Rossi"
     *                   weight: 90
     *                   height: 170
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during update user profile data.
     */
    app.put("/api/userProfiles/me", [authJwt.verifyAccessToken], userProfileController.updateSelf);
};