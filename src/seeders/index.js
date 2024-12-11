const mongoose = require("mongoose");
const seedCategories = require("./categorySeeder");
const seedProducts = require("./productSeeder");
const seedUsers = require("./userSeeder");

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.DB_URL || "mongodb://localhost:27017/final";

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Wait for MongoDB to be fully ready
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log("Starting category seed...");
        await seedCategories();

        console.log("Starting product seed...");
        await seedProducts();

        console.log("Starting user seed...");
        await seedUsers();

        console.log("Database seeded successfully");

        // Don't close connection if running in Docker
        if (process.env.NODE_ENV !== "production") {
            await mongoose.connection.close();
            process.exit(0);
        }
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
