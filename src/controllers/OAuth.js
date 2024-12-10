const { refreshAccessToken, logout } = require("../services/OAuth2");
const { responseFormatter } = require("../utils/responseFormatter");
module.exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const accessToken = await refreshAccessToken(refreshToken);
        console.log("@@accessToken1", accessToken);
        if (!accessToken) {
            console.log("@@accessToken2", accessToken);
            return responseFormatter(res, false, "Invalid refresh token");
        }
        return responseFormatter(res, true, "Refresh token successfully", {
            accessToken,
        });
    } catch (error) {
        console.log("@@error", error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

module.exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        await logout(refreshToken);
        return responseFormatter(res, true, "Logout successful");
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
