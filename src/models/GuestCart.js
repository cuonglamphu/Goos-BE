const mongoose = require("mongoose");

const guestCartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    color: {
        name: String,
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL", "2XL"],
        required: true,
    },
});

const guestCartSchema = new mongoose.Schema(
    {
        guestId: {
            type: String,
            required: true,
            index: true,
        },
        items: [guestCartItemSchema],
        total: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    },
    {
        timestamps: true,
    }
);

// Index for automatic deletion of expired guest carts
guestCartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("GuestCart", guestCartSchema);
