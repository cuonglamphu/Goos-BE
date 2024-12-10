const responseFormatter = require("../utils/responseFormatter");
const User = require("../models/User");
const { verifyAccessToken } = require("../services/OAuth2");

module.exports.adminMiddleware = async (req, res, next) => {
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
            return res
                .status(401)
                .send({ error: "Unauthorized, user not found" });
        } else {
            req.user = user;
            req.token = token;
            if (!user.isAdmin) {
                return responseFormatter(
                    res,
                    false,
                    "Unauthorized, Admin only"
                );
            }
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "Unauthorized" });
    }
};
