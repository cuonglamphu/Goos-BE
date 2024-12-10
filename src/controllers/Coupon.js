const { Coupon } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        return responseFormatter(
            res,
            true,
            "Coupons fetched successfully",
            coupons
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error fetching coupons",
            null,
            error
        );
    }
};

// Get a coupon by id
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return responseFormatter(res, false, "Coupon not found");
        }

        return responseFormatter(
            res,
            true,
            "Coupon fetched successfully",
            coupon
        );
    } catch (error) {
        console.log("error", error);
        return responseFormatter(
            res,
            false,
            "Error fetching coupon",
            null,
            error
        );
    }
};

// Get a coupon by code
exports.getCouponByCode = async (req, res) => {
    if (!req.params.code || req.params.code.length !== 6) {
        return responseFormatter(res, false, "Invalid coupon code");
    }
    try {
        const coupon = await Coupon.findOne({ code: req.params.code });
        console.log("coupon", coupon);
        if (!coupon) {
            return responseFormatter(res, false, "Coupon not found");
        }
        if (coupon.isActive === false) {
            return responseFormatter(res, false, "Coupon is not active");
        }
        if (coupon.startDate > new Date()) {
            return responseFormatter(res, false, "Coupon is not yet active");
        }
        if (coupon.endDate < new Date()) {
            return responseFormatter(res, false, "Coupon has expired");
        }
        return responseFormatter(
            res,
            true,
            "Coupon fetched successfully",
            coupon
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error fetching coupon",
            null,
            error
        );
    }
};

// Create a coupon
exports.createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        console.log("couponData", couponData);
        // Auto generate code with 6 characters
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        couponData.code = code;
        console.log("couponData", couponData);
        const coupon = await Coupon.create(couponData);

        return responseFormatter(
            res,
            true,
            "Coupon created successfully",
            coupon
        );
    } catch (error) {
        console.log("error", error);
        return responseFormatter(
            res,
            false,
            "Error creating coupon",
            null,
            error
        );
    }
};
//Update a coupon
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        return responseFormatter(
            res,
            true,
            "Coupon updated successfully",
            coupon
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error updating coupon",
            null,
            error
        );
    }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error deleting coupon",
            null,
            error
        );
    }
};

// Validate a coupon
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });

        if (!coupon) {
            return responseFormatter(res, false, "Invalid coupon code");
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return responseFormatter(res, false, "Coupon usage limit reached");
        }

        if (cartTotal < coupon.minPurchase) {
            return responseFormatter(
                res,
                false,
                `Minimum purchase amount of $${coupon.minPurchase} required`
            );
        }

        let discount = 0;
        if (coupon.type === "percentage") {
            discount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        } else {
            discount = coupon.value;
        }

        return responseFormatter(res, true, "Coupon applied successfully", {
            coupon,
            discount,
        });
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error validating coupon",
            null,
            error
        );
    }
};
