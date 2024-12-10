const OrderService = require("../services/OrderService");
const { responseFormatter } = require("../utils/responseFormatter");
const { sendOrderConfirmationEmail } = require("../services/EmailService");
const {
    calculateShippingCost,
    getEstimatedDeliveryDate,
} = require("../services/ShippingService");
const { Cart } = require("../models");

// Xử lý checkout cho người dùng đã đăng nhập
exports.authenticatedCheckout = async (req, res) => {
    try {
        const {
            shippingAddress,
            paymentMethod,
            shippingMethod,
            orderNotes,
            couponCode,
        } = req.body;

        console.log(req.user);
        console.log(req.body);
        const cart = await Cart.findOne({ userId: req.user.id }).populate(
            "items.product"
        );

        if (!cart || cart.items.length === 0) {
            return responseFormatter(res, false, "Cart is empty");
        }

        return await processCheckout({
            user: req.user,
            cart,
            shippingAddress,
            paymentMethod,
            shippingMethod,
            orderNotes,
            couponCode,
            res,
        });
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error processing checkout",
            null,
            error
        );
    }
};

// Xử lý checkout cho khách
exports.guestCheckout = async (req, res) => {
    try {
        console.log("Starting guest checkout process...");
        console.log("Request data:", JSON.stringify(req.body, null, 2));

        const {
            guestInfo,
            guestId,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            shippingMethod,
            orderNotes,
            couponCode,
        } = req.body;

        console.log("req.body", req.body);

        // Validate tất cả các trường bắt buộc
        const validationErrors = [];

        // Validate guestInfo
        if (!guestInfo) {
            validationErrors.push("Guest information is required");
        } else {
            // Combine firstName và lastName nếu cần
            const fullName = `${guestInfo.firstName || ""} ${
                guestInfo.lastName || ""
            }`.trim();
            if (!fullName) validationErrors.push("Full name is required");

            if (!guestInfo.email) validationErrors.push("Email is required");
            if (!guestInfo.phone)
                validationErrors.push("Phone number is required");

            // Validate phone format (Việt Nam phone format)
            const phoneRegex = /^(0|84|\+84)(3|5|7|8|9)[0-9]{8}$/;
            if (guestInfo.phone && !phoneRegex.test(guestInfo.phone)) {
                validationErrors.push("Invalid phone number format");
            }
        }

        // Validate shippingAddress
        if (!shippingAddress) {
            validationErrors.push("Shipping address is required");
        } else {
            if (!shippingAddress.address)
                validationErrors.push("Street address is required");
            if (!shippingAddress.city)
                validationErrors.push("City is required");
            if (!shippingAddress.country)
                validationErrors.push("Country is required");

            // Validate phone format cho shipping address nếu có
            if (shippingAddress.phone) {
                const phoneRegex = /^(0|84|\+84)(3|5|7|8|9)[0-9]{8}$/;
                if (!phoneRegex.test(shippingAddress.phone)) {
                    validationErrors.push(
                        "Invalid shipping address phone number format"
                    );
                }
            }
        }

        // Validate payment và shipping method
        const validPaymentMethods = ["cod", "card"];
        const validShippingMethods = ["standard", "express"];
        if (!paymentMethod) {
            validationErrors.push("Payment method is required");
        } else if (!validPaymentMethods.includes(paymentMethod)) {
            validationErrors.push("Invalid payment method");
        }

        if (!shippingMethod) {
            validationErrors.push("Shipping method is required");
        } else if (!validShippingMethods.includes(shippingMethod)) {
            validationErrors.push("Invalid shipping method");
        }

        // Validate guestId
        if (!guestId) validationErrors.push("Guest ID is required");

        // Nếu có lỗi validation, trả về tất cả các lỗi
        if (validationErrors.length > 0) {
            return responseFormatter(res, false, "Validation failed", {
                errors: validationErrors,
            });
        }

        console.log("Calling OrderService.handleGuestCheckout...");
        const { user, cart, userAddress } =
            await OrderService.handleGuestCheckout(
                guestInfo,
                guestId,
                shippingAddress
            );
        console.log("OrderService response:", {
            user: user ? user._id : null,
            cartExists: !!cart,
            cartItemsCount: cart?.items?.length,
            userAddress,
        });

        if (!cart) {
            console.log("Cart not found for guestId:", guestId);
            return responseFormatter(res, false, "Cart not found", {
                error: "CART_NOT_FOUND",
            });
        }

        if (!cart.items || cart.items.length === 0) {
            console.log("Empty cart for guestId:", guestId);
            return responseFormatter(res, false, "Cart is empty", {
                error: "CART_EMPTY",
            });
        }

        // Log cart details
        console.log("Cart details:", {
            itemsCount: cart.items.length,
            total: cart.total,
            items: cart.items.map((item) => ({
                productId: item.product?._id,
                quantity: item.quantity,
                price: item.price,
            })),
        });

        console.log("Proceeding to processCheckout...");
        const result = await processCheckout({
            user,
            cart,
            shippingAddress: userAddress,
            paymentMethod,
            paymentDetails,
            shippingMethod,
            orderNotes,
            couponCode,
            res,
            guestId,
        });
        console.log("Checkout result:", result);

        return result;
    } catch (error) {
        console.error("Checkout error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        return responseFormatter(res, false, "Error processing checkout", {
            error: error.message || "Unknown error",
            code: error.code || "INTERNAL_ERROR",
            details: error.stack,
        });
    }
};

// Hàm xử lý chung cho cả 2 loại checkout
async function processCheckout({
    user,
    cart,
    shippingAddress,
    paymentMethod,
    paymentDetails,
    shippingMethod,
    orderNotes,
    couponCode,
    res,
    guestId,
}) {
    try {
        console.log("Processing checkout...");
        console.log("Cart:", {
            itemsCount: cart.items.length,
            total: cart.total,
        });

        const shippingCost = calculateShippingCost(
            cart.items,
            shippingMethod,
            shippingAddress
        );
        console.log("Calculated shipping cost:", shippingCost);

        const estimatedDeliveryDate = getEstimatedDeliveryDate(shippingMethod);
        const subtotal = cart.total;
        console.log("Applying coupon...");
        const discount = await OrderService.applyCoupon(couponCode, subtotal);
        const total = subtotal + shippingCost - discount;

        const items = cart.items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            price: item.price,
        }));

        console.log("Creating order...");
        const order = await OrderService.createOrder({
            userId: user._id,
            items,
            shippingAddress,
            shippingMethod,
            estimatedDeliveryDate,
            paymentMethod,
            paymentDetails,
            orderNotes,
            subtotal,
            shippingCost,
            total,
            coupon: couponCode
                ? {
                      code: couponCode,
                      discount: discount,
                  }
                : undefined,
            orderNumber: generateOrderNumber(),
        });

        console.log("Finalizing order...");
        const result = await OrderService.finalizeOrder(order, cart, guestId);
        console.log("Order finalized successfully");

        // Send email to user
        await sendOrderConfirmationEmail(user, order, items);

        return responseFormatter(
            res,
            true,
            "Order created successfully",
            result
        );
    } catch (error) {
        console.error("ProcessCheckout error:", error);
        throw error;
    }
}

function generateOrderNumber() {
    return Math.random().toString(36).substring(2, 15);
}
