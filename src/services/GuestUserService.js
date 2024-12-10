const { User } = require("../models");
const { generatePassword } = require("../utils/passwordUtils.js");
const { sendWelcomeEmail } = require("./EmailService");
const bcrypt = require("bcryptjs");
const createOrGetUserFromGuest = async (guestInfo) => {
    try {
        let user = await User.findOne({ email: guestInfo.email });

        if (!user) {
            // Generate a random password for the new user
            const temporaryPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
            // Create new user
            user = new User({
                email: guestInfo.email,
                firstName: guestInfo.firstName,
                lastName: guestInfo.lastName,
                phone: guestInfo.phone,
                password: hashedPassword,
                isGuest: true,
            });

            await user.save();

            try {
                await sendWelcomeEmail(user.email, temporaryPassword);
                console.log("Welcome email sent successfully");
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
        } else {
            const temporaryAccount = await generateAccount();
            const temporaryPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
            await user.save();
            try {
                await sendWelcomeEmail(
                    temporaryAccount,
                    temporaryPassword,
                    user.email
                );
                console.log("Welcome email sent successfully");
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
        }

        return user;
    } catch (error) {
        console.error("Error creating/getting user from guest info:", error);
        throw new Error(
            "Error creating/getting user from guest info: " + error.message
        );
    }
};

const generateAccount = async () => {
    try {
        const tempNumber = Math.floor(Math.random() * 1000000);
        return `temp_${tempNumber}@goos.com`;
    } catch (error) {
        console.error("Error generating account:", error);
        throw new Error("Error generating account: " + error.message);
    }
};

module.exports = {
    createOrGetUserFromGuest,
};
