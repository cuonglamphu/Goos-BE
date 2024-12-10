const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares");
const cartController = require("../controllers/Cart");

router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addToCart);
router.put("/update", authMiddleware, cartController.updateCartItem);
router.put(
    "/updatebyindex",
    authMiddleware,
    cartController.updateCartItemByIndex
);
router.delete("/remove/:itemId", authMiddleware, cartController.removeFromCart);
router.delete(
    "/removebyindex/:itemIndex",
    authMiddleware,
    cartController.removeItemFromCartByIndex
);

module.exports = router;
