const mongoose = require("mongoose");
const seedCategories = require("./categorySeeder");
const seedProducts = require("./productSeeder");
const seedUsers = require("./userSeeder");

const MONGODB_URI = "mongodb://localhost:27017/your_database_name";

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        console.log("Starting category seed...");
        await seedCategories();

        console.log("Starting product seed...");
        await seedProducts();

        console.log("Starting user seed...");
        await seedUsers();

        console.log("Database seeded successfully");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
