const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const User = require("../models/User");
module.exports.generateAccessToken = (user) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!user) {
        throw new Error("User is not defined");
    }
    const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

module.exports.generateRefreshToken = (user) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!user) {
        throw new Error("User is not defined");
    }
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports.verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports.refreshAccessToken = async (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return null;
    }

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
        return null;
    }
    const accessToken = await module.exports.generateAccessToken(user);
    return accessToken;
};

module.exports.logout = async (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return null;
    }
    await User.updateOne({ _id: decoded.id }, { $set: { refreshToken: null } });
};
