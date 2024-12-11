const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/transporter");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../services/OAuth2");
const { responseFormatter } = require("../utils/responseFormatter");
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.isAvailable) {
            return res.status(400).json({ message: "You are banned !" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return responseFormatter(res, true, "Login successfully", {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

module.exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return responseFormatter(res, false, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return responseFormatter(res, true, "User registered successfully", {
            user: newUser,
        });
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// Lấy thông tin người dùng theo ID (Read)
module.exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }
        return responseFormatter(
            res,
            true,
            "Get user by id successfully",
            user
        );
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật thông tin người dùng (Update)
module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    console.log(req.body);
    console.log(id);
    console.log(userData);
    try {
        const user = await User.findByIdAndUpdate(id, userData);
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }

        // Nếu có mật khẩu mới, mã hóa và cập nhật
        if (userData?.password) {
            user.password = await bcrypt.hash(userData.password, 10);
        }
        await user.save();
        const newUser = await User.findById(id);
        return responseFormatter(
            res,
            true,
            "User updated successfully",
            newUser
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// Xóa người dùng (Delete)
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }

        return responseFormatter(res, true, "User deleted successfully");
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// Ban user
module.exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isAvailable: false });
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }
        const newUser = await User.findById(id);
        return responseFormatter(
            res,
            true,
            "User banned successfully",
            newUser
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// Reset password request
module.exports.resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }

        user.resetPasswordToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "5m",
            }
        );
        user.resetPasswordTokenExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${user.resetPasswordToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password",
            text: `Click the following link to reset your password: ${resetPasswordLink}`,
        };
        try {
            await transporter.sendMail(mailOptions);
            return responseFormatter(
                res,
                true,
                "Reset password link sent to email"
            );
        } catch (error) {
            return responseFormatter(
                res,
                false,
                "Internal server error",
                null,
                error
            );
        }
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// Reset password
module.exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return responseFormatter(res, false, "User not found");
        }

        if (user.resetPasswordToken !== token) {
            return responseFormatter(res, false, "Invalid token");
        }

        if (user.resetPasswordTokenExpires < new Date()) {
            return responseFormatter(res, false, "Token expired");
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();
        return responseFormatter(res, true, "Password reset successfully");
    } catch (error) {
        return responseFormatter(res, false, "Invalid token");
    }
};

module.exports.loginWithGoogle = async (req, res) => {
    const { uid, email, firstName, lastName } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                firstName,
                lastName,
                email,
                googleId: uid,
                password: await bcrypt.hash(Math.random().toString(36), 10),
            });
            await user.save();
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return responseFormatter(res, true, "Login with google successfully", {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};
