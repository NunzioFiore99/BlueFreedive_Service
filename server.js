const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const db = require("./app/models");
const { role: Role } = db;

const app = express();
require("dotenv").config();

// Middlewares
app.use(cookieParser());
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); To Be Delete

// CORS settings
const corsOptions = {
    origin: process.env.WEBAPP_URL || "http://localhost:8081", // Client autorizzato
    credentials: true //Permette di inviare cookie
};
app.use(cors(corsOptions));

// Headers
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

// Connect to database
async function connectToDatabase() {
    try {
        await db.mongoose.connect(process.env.MONGODB_URL);
        console.log("Successfully connected to MongoDB.");
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
}

async function initializeRoles() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "ADMIN" }).save();
            await new Role({ name: "USER" }).save();
            console.log("Successfully inserted roles.");
        }
    } catch (err) {
        console.log("Error during role initialization:", err);
    }
}

connectToDatabase().then(async () => {
    await initializeRoles();
});

// Simple routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Nunzio application." });
});

// Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/userProfile.routes')(app);
require('./app/routes/diveSession.routes')(app)

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // OpenAPI version (Swagger)
        info: {
            title: 'BlueFreedive - Rest API Documentation',
            version: '1.0.0',
            description: 'Rest API Documentation for BlueFreedive Backend Service.',
        },
    },
    apis: ['./app/routes/*.js'], // Routes to document
};
const swaggerSpec = swaggerJSDoc(swaggerOptions); // Swagger documentation creation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // SwaggerUI for documentation

// Set port, listen for requests
const SERVICE_PORT = process.env.SERVICE_PORT || 8080;
app.listen(SERVICE_PORT, () => {
    console.log(`Server is running on port ${SERVICE_PORT}.`);
});