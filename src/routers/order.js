const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares");
const orderController = require("../controllers/Order");

router.get("/:orderNumber", orderController.getOrderDetails);
// router.get("/", authMiddleware, orderController.getAllOrders);
router.get("/", orderController.getAllOrders);
router.get("/user/:userId", authMiddleware, orderController.getOrdersByUser);
router.post("/", authMiddleware, orderController.createOrder);
router.put("/:orderNumber", orderController.updateOrder);
router.put("/status/:orderNumber", orderController.updateOrderStatus);
router.delete("/:orderNumber", authMiddleware, orderController.deleteOrder);

module.exports = router;
