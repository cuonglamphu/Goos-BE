const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const addressRouter = require("./address");
const OAuth2Router = require("./oauth2");
const guestCartRouter = require("./guestCart");
const cartRouter = require("./cart");
const checkoutRouter = require("./checkout");
const orderRouter = require("./order");
const couponRouter = require("./coupon");

router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/address", addressRouter);
router.use("/oauth2", OAuth2Router);
router.use("/checkout", checkoutRouter);
router.use("/guestCart", guestCartRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/coupon", couponRouter);
module.exports = router;
