const express = require("express");
const router = express.Router();
const couponController = require("../controllers/Coupon");

router.get("/", couponController.getAllCoupons);
router.get("/:id", couponController.getCouponById);
router.get("/code/:code", couponController.getCouponByCode);
router.post("/", couponController.createCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
