const { Cart, GuestCart, Order, Address, Coupon } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createOrGetUserFromGuest } = require("./GuestUserService");
class OrderService {
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            await order.save();
            return order;
        } catch (error) {
            console.log("Error creating order", error);
            return null;
        }
    }

    async finalizeOrder(order, cart, guestId) {
        try {
            // By now we not implement payment method, just simulate it with a delay and return the order
            // await new Promise((resolve) => setTimeout(resolve, 10));
            // clear the cart
            if (cart) {
                await Cart.findByIdAndDelete(cart._id);
            }
            console.log("guestId", guestId);
            if (guestId) {
                await GuestCart.findOneAndDelete({ guestId });
            }

            return order;
        } catch (error) {
            console.log("Error finalizing order", error);
            return null;
        }
    }

    async handleUserAndCart(user, guestInfo, guestId, shippingAddress) {
        let cart, userAddress;

        if (!user && guestInfo) {
            const result = await this.handleGuestCheckout(
                guestInfo,
                guestId,
                shippingAddress
            );
            user = result.user;
            cart = result.cart;
            userAddress = result.userAddress;
        } else {
            cart = await Cart.findOne({ userId: user.id }).populate(
                "items.product"
            );
            userAddress = await Address.findById(shippingAddress);
        }
        return { user, cart, userAddress };
    }

    async handleGuestCheckout(guestInfo, guestId, shippingAddress) {
        try {
            const user = await createOrGetUserFromGuest(guestInfo);

            const userAddress = new Address({
                userId: user._id,
                ...shippingAddress,
                isDefault: true,
            });
            await userAddress.save();

            const cart = await GuestCart.findOne({ guestId }).populate(
                "items.product"
            );
            return { user, cart, userAddress };
        } catch (error) {
            console.log("Error handling guest checkout", error);
            return null;
        }
    }

    async applyCoupon(couponCode, subtotal) {
        if (!couponCode) return 0;

        try {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
            });
            if (!coupon) {
                console.log("coupon not found", couponCode);
                return 0;
            }
            let discount = this.calculateDiscount(coupon, subtotal);
            await this.updateCouponUsage(coupon);

            return discount;
        } catch (error) {
            console.log("Error applying coupon", error);
            return 0;
        }
    }

    async processPayment(order, total) {
        // just simulate it with a delay now
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return { paymentIntent: "paymentIntent" };
    }

    calculateDiscount(coupon, subtotal) {
        console.log("coupon", coupon);
        if (coupon.type === "percentage") {
            console.log("subtotal", subtotal);
            console.log("coupon.value", coupon.value);
            return (subtotal * coupon.value) / 100;
        } else if (coupon.type === "fixed") {
            console.log("coupon.value", coupon.value);
            return coupon.value;
        }
        return 0;
    }

    async updateCouponUsage(coupon) {
        try {
            coupon.usedCount += 1;
            await coupon.save();
        } catch (error) {
            console.log("Error updating coupon usage", error);
        }
    }
}

module.exports = new OrderService();
