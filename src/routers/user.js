const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares/authMiddleWare");
const { adminMiddleware } = require("../middlewares/adminMiddleWare");
router.post("/login", userController.login);
router.post("/register", userController.register);
// CRUD
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
// Reset password
router.post("/reset-password", userController.resetPasswordRequest);
router.post("/reset-password/:token", userController.resetPassword);
// Login with Google
router.post("/login-google", userController.loginWithGoogle);
// Ban user
router.put("/ban/:id", adminMiddleware, userController.banUser);
module.exports = router;
