const { authJwt, validateRequestParam, validateRequestBody } = require("../middlewares");
const diveSessionController = require("../controllers/diveSession.controller");

module.exports = function(app) {
    //Admin and User

    /**
     * @swagger
     * /api/diveSessions/me:
     *   post:
     *     summary: Create a new dive session for the authenticated user
     *     tags:
     *       - Dive Session
     *     description: Creates a new dive session for the currently authenticated user.
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
     *               date:
     *                 type: string
     *                 format: date-time
     *                 description: The date and time when the dive session took place
     *                 example: "2024-11-14T08:30:00Z"
     *               location:
     *                 type: string
     *                 description: The location of the dive
     *                 example: "Great Barrier Reef"
     *               gpsLocation:
     *                 type: object
     *                 properties:
     *                   latitude:
     *                     type: number
     *                     format: float
     *                     description: Latitude of the dive location
     *                     example: -16.4896
     *                   longitude:
     *                     type: number
     *                     format: float
     *                     description: Longitude of the dive location
     *                     example: 145.0807
     *               waterType:
     *                 type: string
     *                 description: The type of water (e.g., Saltwater, Freshwater)
     *                 example: "SEA"
     *               temperature:
     *                 type: number
     *                 format: float
     *                 description: The water temperature in degrees Celsius
     *                 example: 28.5
     *               diveCount:
     *                 type: integer
     *                 description: The number of dives performed during this session
     *                 example: 2
     *               maxDepth:
     *                 type: number
     *                 format: float
     *                 description: The maximum depth reached during the dive (in meters)
     *                 example: 35
     *               maxDiveTime:
     *                 type: integer
     *                 description: The maximum dive time in minutes
     *                 example: 45
     *               notes:
     *                 type: string
     *                 description: Additional notes or observations from the dive session
     *                 example: "Beautiful coral and diverse marine life."
     *     responses:
     *       201:
     *         description: Dive session created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the dive session
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 user:
     *                   type: string
     *                   description: The user who performed the dive
     *                   example: "john_doe"
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the dive session took place
     *                   example: "2024-11-14T08:30:00Z"
     *                 location:
     *                   type: string
     *                   description: The location of the dive
     *                   example: "Great Barrier Reef"
     *                 gpsLocation:
     *                   type: object
     *                   properties:
     *                     latitude:
     *                       type: number
     *                       format: float
     *                       description: Latitude of the dive location
     *                       example: -16.4896
     *                     longitude:
     *                       type: number
     *                       format: float
     *                       description: Longitude of the dive location
     *                       example: 145.0807
     *                 waterType:
     *                   type: string
     *                   description: The type of water (e.g., Saltwater, Freshwater)
     *                   example: "SEA"
     *                 temperature:
     *                   type: number
     *                   format: float
     *                   description: The water temperature in degrees Celsius
     *                   example: 28.5
     *                 diveCount:
     *                   type: integer
     *                   description: The number of dives performed during this session
     *                   example: 2
     *                 maxDepth:
     *                   type: number
     *                   format: float
     *                   description: The maximum depth reached during the dive (in meters)
     *                   example: 35
     *                 maxDiveTime:
     *                   type: integer
     *                   description: The maximum dive time in minutes
     *                   example: 45
     *                 notes:
     *                   type: string
     *                   description: Additional notes or observations from the dive session
     *                   example: "Beautiful coral and diverse marine life."
     *       400:
     *         description: Invalid request data.
     *       500:
     *         description: Server error during dive session creation.
     */
    app.post("/api/diveSessions/me", [authJwt.verifyAccessToken, validateRequestBody.validateDiveSessionRequestBody], diveSessionController.createMyDiveSession);

    /**
     * @swagger
     * /api/diveSessions/me:
     *   get:
     *     summary: Retrieve all dive sessions for the authenticated user
     *     tags:
     *       - Dive Session
     *     description: Retrieves a list of all dive sessions for the currently authenticated user.
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
     *         description: A list of dive sessions.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Unique identifier for the dive session
     *                     example: "64afef6ed4a9b12345abcd67"
     *                   user:
     *                     type: string
     *                     description: The user who performed the dive
     *                     example: "john_doe"
     *                   date:
     *                     type: string
     *                     format: date-time
     *                     description: The date and time when the dive session took place
     *                     example: "2024-11-14T08:30:00Z"
     *                   location:
     *                     type: string
     *                     description: The location of the dive
     *                     example: "Great Barrier Reef"
     *                   gpsLocation:
     *                     type: object
     *                     properties:
     *                       latitude:
     *                         type: number
     *                         format: float
     *                         description: Latitude of the dive location
     *                         example: -16.4896
     *                       longitude:
     *                         type: number
     *                         format: float
     *                         description: Longitude of the dive location
     *                         example: 145.0807
     *                   waterType:
     *                     type: string
     *                     description: The type of water (e.g., Saltwater, Freshwater)
     *                     example: "SEA"
     *                   temperature:
     *                     type: number
     *                     format: float
     *                     description: The water temperature in degrees Celsius
     *                     example: 28.5
     *                   diveCount:
     *                     type: integer
     *                     description: The number of dives performed during this session
     *                     example: 2
     *                   maxDepth:
     *                     type: number
     *                     format: float
     *                     description: The maximum depth reached during the dive (in meters)
     *                     example: 35
     *                   maxDiveTime:
     *                     type: integer
     *                     description: The maximum dive time in minutes
     *                     example: 45
     *                   notes:
     *                     type: string
     *                     description: Additional notes or observations from the dive session
     *                     example: "Beautiful coral and diverse marine life."
     *       500:
     *         description: Server error during retrieving dive sessions.
     */
    app.get("/api/diveSessions/me", [authJwt.verifyAccessToken], diveSessionController.retrieveMyDiveSessions);

    /**
     * @swagger
     * /api/diveSessions/me/{id}:
     *   get:
     *     summary: Retrieve a specific dive session by ID
     *     tags:
     *       - Dive Session
     *     description: Retrieves a specific dive session for the currently authenticated user by its ID.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         description: The unique identifier of the dive session.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A specific dive session.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the dive session
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 user:
     *                   type: string
     *                   description: The user who performed the dive
     *                   example: "john_doe"
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the dive session took place
     *                   example: "2024-11-14T08:30:00Z"
     *                 location:
     *                   type: string
     *                   description: The location of the dive
     *                   example: "Great Barrier Reef"
     *                 gpsLocation:
     *                   type: object
     *                   properties:
     *                     latitude:
     *                       type: number
     *                       format: float
     *                       description: Latitude of the dive location
     *                       example: -16.4896
     *                     longitude:
     *                       type: number
     *                       format: float
     *                       description: Longitude of the dive location
     *                       example: 145.0807
     *                 waterType:
     *                   type: string
     *                   description: The type of water (e.g., Saltwater, Freshwater)
     *                   example: "SEA"
     *                 temperature:
     *                   type: number
     *                   format: float
     *                   description: The water temperature in degrees Celsius
     *                   example: 28.5
     *                 diveCount:
     *                   type: integer
     *                   description: The number of dives performed during this session
     *                   example: 2
     *                 maxDepth:
     *                   type: number
     *                   format: float
     *                   description: The maximum depth reached during the dive (in meters)
     *                   example: 35
     *                 maxDiveTime:
     *                   type: integer
     *                   description: The maximum dive time in minutes
     *                   example: 45
     *                 notes:
     *                   type: string
     *                   description: Additional notes or observations from the dive session
     *                   example: "Beautiful coral and diverse marine life."
     *       400:
     *         description: No dive session inserted
     *       404:
     *         description: Dive session not found.
     *       500:
     *         description: Server error during retrieving dive session.
     */
    app.get("/api/diveSessions/me/:id", [authJwt.verifyAccessToken, validateRequestParam.validateIdPathParam], diveSessionController.retrieveMyDiveSession);

    /**
     * @swagger
     * /api/diveSessions/me/{id}:
     *   put:
     *     summary: Update a specific dive session by ID
     *     tags:
     *       - Dive Session
     *     description: Updates a specific dive session for the currently authenticated user.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         description: The unique identifier of the dive session.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               date:
     *                 type: string
     *                 format: date-time
     *                 description: The date and time when the dive session took place
     *                 example: "2024-11-14T08:30:00Z"
     *               location:
     *                 type: string
     *                 description: The location of the dive
     *                 example: "Great Barrier Reef"
     *               gpsLocation:
     *                 type: object
     *                 properties:
     *                   latitude:
     *                     type: number
     *                     format: float
     *                     description: Latitude of the dive location
     *                     example: -16.4896
     *                   longitude:
     *                     type: number
     *                     format: float
     *                     description: Longitude of the dive location
     *                     example: 145.0807
     *               waterType:
     *                 type: string
     *                 description: The type of water (e.g., Saltwater, Freshwater)
     *                 example: "SEA"
     *               temperature:
     *                 type: number
     *                 format: float
     *                 description: The water temperature in degrees Celsius
     *                 example: 28.5
     *               diveCount:
     *                 type: integer
     *                 description: The number of dives performed during this session
     *                 example: 2
     *               maxDepth:
     *                 type: number
     *                 format: float
     *                 description: The maximum depth reached during the dive (in meters)
     *                 example: 35
     *               maxDiveTime:
     *                 type: integer
     *                 description: The maximum dive time in minutes
     *                 example: 45
     *               notes:
     *                 type: string
     *                 description: Additional notes or observations from the dive session
     *                 example: "Beautiful coral and diverse marine life."
     *     responses:
     *       201:
     *         description: Dive session updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the dive session
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 user:
     *                   type: string
     *                   description: The user who performed the dive
     *                   example: "john_doe"
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the dive session took place
     *                   example: "2024-11-14T08:30:00Z"
     *                 location:
     *                   type: string
     *                   description: The location of the dive
     *                   example: "Great Barrier Reef"
     *                 gpsLocation:
     *                   type: object
     *                   properties:
     *                     latitude:
     *                       type: number
     *                       format: float
     *                       description: Latitude of the dive location
     *                       example: -16.4896
     *                     longitude:
     *                       type: number
     *                       format: float
     *                       description: Longitude of the dive location
     *                       example: 145.0807
     *                 waterType:
     *                   type: string
     *                   description: The type of water (e.g., Saltwater, Freshwater)
     *                   example: "SEA"
     *                 temperature:
     *                   type: number
     *                   format: float
     *                   description: The water temperature in degrees Celsius
     *                   example: 28.5
     *                 diveCount:
     *                   type: integer
     *                   description: The number of dives performed during this session
     *                   example: 2
     *                 maxDepth:
     *                   type: number
     *                   format: float
     *                   description: The maximum depth reached during the dive (in meters)
     *                   example: 35
     *                 maxDiveTime:
     *                   type: integer
     *                   description: The maximum dive time in minutes
     *                   example: 45
     *                 notes:
     *                   type: string
     *                   description: Additional notes or observations from the dive session
     *                   example: "Beautiful coral and diverse marine life."
     *       400:
     *         description: Body or id not inserted.
     *       404:
     *         description: Dive session not found.
     *       500:
     *         description: Server error during updating dive session.
     */
    app.put("/api/diveSessions/me/:id", [authJwt.verifyAccessToken, validateRequestParam.validateIdPathParam, validateRequestBody.validateDiveSessionRequestBody], diveSessionController.updateMyDiveSession);

    /**
     * @swagger
     * /api/diveSessions/me/{id}:
     *   delete:
     *     summary: Delete a specific dive session by ID
     *     tags:
     *       - Dive Session
     *     description: Deletes a specific dive session for the currently authenticated user by its ID.
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         schema:
     *           type: string
     *         description: The Bearer token to access the protected resource.
     *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzMxNjEzMTIyLCJleHAiOjE3MzE2MTY3MjJ9.-OkmWlCfZiHM9Cr_O9Va3v8tYb8_7L92oe-DOCmgVe0"
     *       - in: path
     *         name: id
     *         required: true
     *         description: The unique identifier of the dive session to be deleted.
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Dive session deleted successfully.
     *       400:
     *         description: ID not present.
     *       404:
     *         description: Dive session not found.
     *       500:
     *         description: Server error during deleting dive session.
     */
    app.delete("/api/diveSessions/me/:id", [authJwt.verifyAccessToken, validateRequestParam.validateIdPathParam], diveSessionController.deleteMyDiveSession);

    //Admin

    /**
     * @swagger
     * /api/diveSessions:
     *   get:
     *     summary: Retrieve all dive sessions
     *     tags:
     *       - Dive Session
     *     description: Retrieves all dive sessions for the authenticated user with ADMIN role.
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
     *         description: List of all dive sessions.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: Unique identifier for the dive session
     *                     example: "64afef6ed4a9b12345abcd67"
     *                   user:
     *                     type: string
     *                     description: The user who performed the dive
     *                     example: "john_doe"
     *                   date:
     *                     type: string
     *                     format: date-time
     *                     description: The date and time when the dive session took place
     *                     example: "2024-11-14T08:30:00Z"
     *                   location:
     *                     type: string
     *                     description: The location of the dive
     *                     example: "Great Barrier Reef"
     *                   gpsLocation:
     *                     type: object
     *                     properties:
     *                       latitude:
     *                         type: number
     *                         format: float
     *                         description: Latitude of the dive location
     *                         example: -16.4896
     *                       longitude:
     *                         type: number
     *                         format: float
     *                         description: Longitude of the dive location
     *                         example: 145.0807
     *                   waterType:
     *                     type: string
     *                     description: The type of water (e.g., Saltwater, Freshwater)
     *                     example: "SEA"
     *                   temperature:
     *                     type: number
     *                     format: float
     *                     description: The water temperature in degrees Celsius
     *                     example: 28.5
     *                   diveCount:
     *                     type: integer
     *                     description: The number of dives performed during this session
     *                     example: 2
     *                   maxDepth:
     *                     type: number
     *                     format: float
     *                     description: The maximum depth reached during the dive (in meters)
     *                     example: 35
     *                   maxDiveTime:
     *                     type: integer
     *                     description: The maximum dive time in minutes
     *                     example: 45
     *                   notes:
     *                     type: string
     *                     description: Additional notes or observations from the dive session
     *                     example: "Beautiful coral and diverse marine life."
     *       500:
     *         description: Server error during retrieve dive sessions.
     */
    app.get("/api/diveSessions", [authJwt.verifyAccessToken, authJwt.isAdmin], diveSessionController.retrieveDiveSessions);

    /**
     * @swagger
     * /api/diveSessions/{id}:
     *   get:
     *     summary: Retrieve a specific dive session by ID
     *     tags:
     *       - Dive Session
     *     description: Retrieves the details of a specific dive session by ID for the authenticated user with ADMIN role.
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
     *         description: The unique identifier of the dive session.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Dive session details.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: Unique identifier for the dive session
     *                   example: "64afef6ed4a9b12345abcd67"
     *                 user:
     *                   type: string
     *                   description: The user who performed the dive
     *                   example: "john_doe"
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time when the dive session took place
     *                   example: "2024-11-14T08:30:00Z"
     *                 location:
     *                   type: string
     *                   description: The location of the dive
     *                   example: "Great Barrier Reef"
     *                 gpsLocation:
     *                   type: object
     *                   properties:
     *                     latitude:
     *                       type: number
     *                       format: float
     *                       description: Latitude of the dive location
     *                       example: -16.4896
     *                     longitude:
     *                       type: number
     *                       format: float
     *                       description: Longitude of the dive location
     *                       example: 145.0807
     *                 waterType:
     *                   type: string
     *                   description: The type of water (e.g., Saltwater, Freshwater)
     *                   example: "SEA"
     *                 temperature:
     *                   type: number
     *                   format: float
     *                   description: The water temperature in degrees Celsius
     *                   example: 28.5
     *                 diveCount:
     *                   type: integer
     *                   description: The number of dives performed during this session
     *                   example: 2
     *                 maxDepth:
     *                   type: number
     *                   format: float
     *                   description: The maximum depth reached during the dive (in meters)
     *                   example: 35
     *                 maxDiveTime:
     *                   type: integer
     *                   description: The maximum dive time in minutes
     *                   example: 45
     *                 notes:
     *                   type: string
     *                   description: Additional notes or observations from the dive session
     *                   example: "Beautiful coral and diverse marine life."
     *       400:
     *         description: No dive session id inserted.
     *       404:
     *         description: Dive session not found.
     *       500:
     *         description: Server error during retrieve dive session.
     */
    app.get("/api/diveSessions/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam.validateIdPathParam], diveSessionController.retrieveDiveSession);

    /**
     * @swagger
     * /api/diveSessions/{id}:
     *   delete:
     *     summary: Delete a specific dive session by ID
     *     tags:
     *       - Dive Session
     *     description: Deletes a specific dive session by ID for the authenticated user with ADMIN role.
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
     *         description: The unique identifier of the dive session to be deleted.
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Dive session deleted successfully.
     *       400:
     *         description: No dive session inserted.
     *       404:
     *         description: Dive session not found.
     *       500:
     *         description: Server error during delete dive session.
     */
    app.delete("/api/diveSessions/:id", [authJwt.verifyAccessToken, authJwt.isAdmin, validateRequestParam.validateIdPathParam], diveSessionController.deleteDiveSession);
}