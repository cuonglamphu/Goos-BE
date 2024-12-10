const express = require("express");
const router = express.Router();
const { refreshToken, logout } = require("../controllers/OAuth");

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
