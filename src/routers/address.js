const { addressController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const express = require("express");
const router = express.Router();

router.get("/", authMiddleware, addressController.GET_ReadMany);
router.get(
    "/default-address",
    authMiddleware,
    addressController.GET_ReadDefaultAddress
);
router.post("", authMiddleware, addressController.POST_Create);
router.put("/:id", authMiddleware, addressController.PUT_Update);
router.delete("/:id", authMiddleware, addressController.DELETE_DeleteById);

module.exports = router;
