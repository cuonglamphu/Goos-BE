const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyAccessToken } = require("../services/OAuth2");

module.exports.authMiddleware = async (req, res, next) => {
    if (!req.header("Authorization")) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");

    try {
        const decoded = verifyAccessToken(token);
        const user = await User.findOne({
            _id: decoded.id,
        });
        if (!user) {
            return res.status(401).send({ error: "Unauthorized user" });
        } else {
            req.user = user;
            req.token = token;
            next();
        }
    } catch (error) {
        res.status(401).send({ error: "Unauthorized error" });
    }
};
