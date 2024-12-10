const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        guestInfo: {
            email: String,
            firstName: String,
            lastName: String,
            phone: String,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: Number,
                color: {
                    name: String,
                    colorClass: String,
                    imgSrc: String,
                },
                size: String,
                price: Number,
            },
        ],
        subtotal: {
            type: Number,
            required: true,
        },
        coupon: {
            code: String,
            discount: Number,
        },
        total: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "address",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["card", "cod"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        orderNotes: String,
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        trackingNumber: String,
        shippingMethod: {
            type: String,
            enum: ["standard", "express"],
            required: true,
        },
        shippingCost: {
            type: Number,
            required: true,
        },
        estimatedDeliveryDate: Date,
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                    ],
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                note: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Generate unique order number before saving
orderSchema.pre("save", async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD-${year}${month}-${(count + 1)
            .toString()
            .padStart(4, "0")}`;
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);
