const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Để hash password

const seedUsers = async () => {
    try {
        // Xóa tất cả users hiện có
        await User.deleteMany({});

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const userPassword = await bcrypt.hash("user123", salt);

        const userData = [
            {
                firstName: "Admin",
                lastName: "User",
                email: "admin@example.com",
                password: adminPassword,
                isAdmin: true, // Thêm trường này vào schema nếu cần phân biệt admin
                wishlist: [],
                isGuest: false,
            },
            {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: userPassword,
                wishlist: [],
                isGuest: false,
            },
            {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                password: userPassword,
                wishlist: [],
                isGuest: false,
            },
        ];

        // Import dữ liệu mới
        const createdUsers = await User.insertMany(userData);
        console.log("Users seeded successfully");
        console.log("Admin account:", {
            email: "admin@example.com",
            password: "admin123",
        });
    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

module.exports = seedUsers;
