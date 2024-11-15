const { authJwt, validateRequestParam } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
    // Admin and User

    /**
     * @swagger
     * /api/users/me:
     *   get:
     *     summary: Retrieve user
     *     tags:
     *       - User
     *     description: Retrieve user data by user in jwt token.
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
     *         description: Retrieve user data.
     *         content:
     *           application/json:
     *             examples:
     *               success:
     *                 summary: Successful response
     *                 value:
     *                   id: "6733b9cc83a4f6916c12c821"
     *                   username: "mariorossi"
     *                   email: "mario.rossi@example.com"
     *                   password: "$2a$08$LkQ.FzhT5TCo7bIvUQyqu8ZrMsSm75k.8pU/AfP3PFTisys6gwHa"
     *                   roles: ["ADMIN"]
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during retrieve user data.
     */
    app.get("/api/users/me", [authJwt.verifyAccessToken], userController.retrieveSelf)

    /**
     * @swagger
     * /api/users/me:
     *   patch:
     *     summary: Update partial user
     *     tags:
     *       - User
     *     description: Update partial user data (email - password) by user in jwt token.
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
     *               email:
     *                 type: string
     *                 description: User email
     *                 example: "mario.rossi@example.com"
     *               password:
     *                 type: string
     *                 description: User password
     *                 example: "Password@123"
     *     responses:
     *       204:
     *         description: Update partial user data.
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during update partial user data.
     */
    app.patch("/api/users/me", [authJwt.verifyAccessToken], userController.updateSelf)

    // Admin

    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create new users
     *     tags:
     *       - User
     *     description: Create new users.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token (only ADMIN role) to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: array
     *             items:
     *               type: object
     *               properties:
     *                 username:
     *                   type: string
     *                   description: New username
     *                   example: "Mario"
     *                 email:
     *                   type: string
     *                   description: New user email
     *                   example: "mario.rossi@example.com"
     *                 roles:
     *                   type: array
     *                   description: List of roles for the new user
     *                   items:
     *                     type: string
     *                     enum:
     *                       - "ADMIN"
     *                       - "USER"
     *                   example: ["ADMIN", "USER"]
     *     responses:
     *       201:
     *         description: A list of user objects created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Unique identifier for the user
     *                     example: "64afef6ed4a9b12345abcd67"
     *                   username:
     *                     type: string
     *                     description: Username of the user
     *                     example: "MarioRossi"
     *                   email:
     *                     type: string
     *                     description: User's email address
     *                     example: "mario.rossi@example.com"
     *                   password:
     *                     type: string
     *                     description: Hashed password of the user
     *                     example: "$2a$10$7Q7HaJH8bNz/7Jp9Y2y5cuKsz/bT1P1J0mj2H5"
     *                   roles:
     *                     type: array
     *                     description: List of roles assigned to the user
     *                     items:
     *                       type: string
     *                     example: ["ADMIN", "USER"]
     *       400:
     *         description: No users provided.
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during create users.
     */
    app.post("/api/users", [authJwt.verifyAccessToken, authJwt.isAdmin], userController.createUsers);

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Retrieve users
     *     tags:
     *       - User
     *     description: Retrieve all user data.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token (only ADMIN role) to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *     responses:
     *       200:
     *         description: A list of users.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Unique identifier for the user
     *                     example: "64afef6ed4a9b12345abcd67"
     *                   username:
     *                     type: string
     *                     description: Username of the user
     *                     example: "MarioRossi"
     *                   email:
     *                     type: string
     *                     description: User's email address
     *                     example: "mario.rossi@example.com"
     *                   password:
     *                     type: string
     *                     description: Hashed password of the user
     *                     example: "$2a$10$7Q7HaJH8bNz/7Jp9Y2y5cuKsz/bT1P1J0mj2H5"
     *                   roles:
     *                     type: array
     *                     description: List of roles assigned to the user
     *                     items:
     *                       type: string
     *                     example: ["ADMIN", "USER"]
     *       500:
     *         description: Server error during retrieve users.
     */
    app.get("/api/users", [authJwt.verifyAccessToken, authJwt.isAdmin], userController.retrieveUsers)

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Retrieve user by id
     *     tags:
     *       - User
     *     description: Retrieve user data by id.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token (only ADMIN role) to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique identifier of the user to retrieve.
     *     responses:
     *       200:
     *         description: User data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the user
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 username:
     *                   type: string
     *                   description: Username of the user
     *                   example: "MarioRossi"
     *                 email:
     *                   type: string
     *                   description: User's email address
     *                   example: "mario.rossi@example.com"
     *                 password:
     *                   type: string
     *                   description: Hashed password of the user
     *                   example: "$2a$10$7Q7HaJH8bNz/7Jp9Y2y5cuKsz/bT1P1J0mj2H5"
     *                 roles:
     *                   type: array
     *                   description: List of roles assigned to the user
     *                   items:
     *                     type: string
     *                   example: ["ADMIN", "USER"]
     *       500:
     *         description: Server error during retrieve user.
     */
    app.get("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.retrieveUser)

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     summary: Update user by id
     *     tags:
     *       - User
     *     description: Update user data by id.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token (only ADMIN role) to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique identifier of the user to be updated.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: New username
     *                 example: "Mario"
     *               email:
     *                 type: string
     *                 description: New user email
     *                 example: "mario.rossi@example.com"
     *               password:
     *                 type: string
     *                 description: New user password
     *                 example: "Password@123"
     *               roles:
     *                 type: array
     *                 description: New list of roles for the user
     *                 items:
     *                   type: string
     *                   enum:
     *                     - "ADMIN"
     *                     - "USER"
     *                 example: ["ADMIN", "USER"]
     *     responses:
     *       201:
     *         description: Update user data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the user
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 username:
     *                   type: string
     *                   description: Username of the user
     *                   example: "MarioRossi"
     *                 email:
     *                   type: string
     *                   description: User's email address
     *                   example: "mario.rossi@example.com"
     *                 password:
     *                   type: string
     *                   description: Hashed password of the user
     *                   example: "$2a$10$7Q7HaJH8bNz/7Jp9Y2y5cuKsz/bT1P1J0mj2H5"
     *                 roles:
     *                   type: array
     *                   description: List of roles assigned to the user
     *                   items:
     *                     type: string
     *                   example: ["ADMIN", "USER"]
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during update user.
     */
    app.put("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.updateUser);

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     summary: Delete user by id
     *     tags:
     *       - User
     *     description: Delete user by id.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token (only ADMIN role) to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Unique identifier of the user to retrieve.
     *     responses:
     *       204:
     *         description: Delete user data.
     *       404:
     *         description: User not found.
     *       500:
     *         description: Server error during delete user.
     */
    app.delete("/api/users/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam], userController.deleteUser);
};