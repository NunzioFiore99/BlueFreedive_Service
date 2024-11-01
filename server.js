const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// CORS settings
const corsOptions = {
    origin: process.env.WEBAPP_URL || "http://localhost:8081"
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require("./app/models");
const Role = db.role;

async function connectToDatabase() {
    try {
        await db.mongoose.connect(process.env.MONGODB_URL);
        console.log("Successfully connected to MongoDB.");
        await initializeRoles();
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
}

// Roles setup if database is empty
async function initializeRoles() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "admin" }).save();
            console.log("Added 'admin' to roles collection");

            await new Role({ name: "user" }).save();
            console.log("Added 'user' to roles collection");
        }
    } catch (err) {
        console.log("Error during role initialization:", err);
    }
}

// Connect to database
connectToDatabase();

// Simple routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Nunzio application." });
});

// Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// Set port, listen for requests
const SERVICE_PORT = process.env.SERVICE_PORT || 8080;
app.listen(SERVICE_PORT, () => {
    console.log(`Server is running on port ${SERVICE_PORT}.`);
});