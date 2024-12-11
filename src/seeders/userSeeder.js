const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Để hash password

const seedUsers = async () => {
    try {
        // Xóa tất cả users hiện có
        await User.deleteMany({});

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin", salt);
        const userPassword = await bcrypt.hash("user", salt);

        const userData = [
            {
                firstName: "Admin",
                lastName: "User",
                email: "admin@goos.com",
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
            email: "admin@goos.com",
            password: "admin",
        });
    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

module.exports = seedUsers;
