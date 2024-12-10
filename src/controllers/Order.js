const { Order } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");
const {
    calculateShippingCost,
    getEstimatedDeliveryDate,
} = require("../services/ShippingService");
const {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
} = require("../services/EmailService");

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "firstName lastName email")
            .populate("items.product")
            .populate("shippingAddress");
        return responseFormatter(
            res,
            true,
            "Orders retrieved successfully",
            orders
        );
    } catch (error) {
        console.log("error", error);
        return responseFormatter(
            res,
            false,
            "Error retrieving orders",
            null,
            error
        );
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("userId", "firstName lastName email")
            .populate("items.product")
            .populate("shippingAddress");

        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }

        return responseFormatter(
            res,
            true,
            "Order retrieved successfully",
            order
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error retrieving order",
            null,
            error
        );
    }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const orders = await Order.find({ userId })
            .populate("items.product")
            .populate("shippingAddress")
            .sort({ createdAt: -1 }); // Sort by newest first
        console.log(orders);
        return responseFormatter(
            res,
            true,
            "Orders retrieved successfully",
            orders
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error retrieving orders",
            null,
            error
        );
    }
};

// Create order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, total, shippingAddress, paymentMethod } =
            req.body;

        const order = new Order({
            userId,
            items,
            total,
            shippingAddress,
            paymentMethod,
        });

        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate("userId", "firstName lastName email")
            .populate("items.product")
            .populate("shippingAddress");

        return responseFormatter(
            res,
            true,
            "Order created successfully",
            populatedOrder
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error creating order",
            null,
            error
        );
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const updateData = req.body;

        // Don't allow updating certain fields directly
        delete updateData.userId;
        delete updateData.items;
        delete updateData.total;

        const order = await Order.findOneAndUpdate(
            { orderNumber },
            { $set: updateData },
            { new: true }
        )
            .populate("userId", "firstName lastName email")
            .populate("items.product")
            .populate("shippingAddress");

        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }

        return responseFormatter(
            res,
            true,
            "Order updated successfully",
            order
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error updating order",
            null,
            error
        );
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const order = await Order.findOneAndDelete({ orderNumber });

        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }

        return responseFormatter(res, true, "Order deleted successfully");
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error deleting order",
            null,
            error
        );
    }
};

// Get shipping cost estimate
exports.getShippingCost = async (req, res) => {
    try {
        const { items, shippingMethod, address } = req.body;
        const cost = calculateShippingCost(items, shippingMethod, address);
        const estimatedDeliveryDate = getEstimatedDeliveryDate(shippingMethod);

        return responseFormatter(res, true, "Shipping cost calculated", {
            cost,
            estimatedDeliveryDate,
        });
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error calculating shipping cost",
            null,
            error
        );
    }
};

// Get order history for user
exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("items.product")
            .populate("shippingAddress");

        return responseFormatter(
            res,
            true,
            "Orders retrieved successfully",
            orders
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error retrieving orders",
            null,
            error
        );
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        console.log("orderNumber", orderNumber);
        const order = await Order.findOne({ orderNumber })
            .populate("items.product")
            .populate("shippingAddress");
        console.log("order", order);
        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }
        console.log("req.user", req.user);
        console.log("order.userId", order.userId);
        // Check if user has access to this order
        // if (!req.user && order.userId.toString() !== req.user.id) {
        //     return responseFormatter(res, false, "Unauthorized");
        // }

        return responseFormatter(
            res,
            true,
            "Order retrieved successfully",
            order
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error retrieving order",
            null,
            error
        );
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { status, note } = req.body;

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }

        // Add status to history
        order.statusHistory.push({
            status,
            note,
        });
        order.status = status;

        await order.save();

        // // Send email notification
        // const email = order.userId ? order.userId.email : order.guestInfo.email;
        // await sendOrderStatusUpdate(order, email);

        return responseFormatter(
            res,
            true,
            "Order status updated successfully",
            order
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error updating order status",
            null,
            error
        );
    }
};

// Track order
exports.trackOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const order = await Order.findOne({ orderNumber }).select(
            "orderNumber status statusHistory trackingNumber estimatedDeliveryDate"
        );

        if (!order) {
            return responseFormatter(res, false, "Order not found");
        }

        return responseFormatter(
            res,
            true,
            "Order tracking info retrieved",
            order
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error tracking order",
            null,
            error
        );
    }
};
