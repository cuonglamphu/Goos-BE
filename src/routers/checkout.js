const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares");
const checkoutController = require("../controllers/Checkout");

router.post(
    "/authenticated",
    authMiddleware,
    checkoutController.authenticatedCheckout
);
router.post("/guest", checkoutController.guestCheckout);
module.exports = router;
