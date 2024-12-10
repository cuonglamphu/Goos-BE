const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
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
        colorClass: String,
        imgSrc: String,
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL", "2XL"],
        required: true,
    },
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        items: [cartItemSchema],
        total: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
