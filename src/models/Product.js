const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        categoryId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        oldPrice: { type: Number },
        price: { type: Number, required: true },
        colours: [
            {
                name: String,
                colorClass: String,
                imgSrc: String,
                oldPrice: Number,
                price: Number,
            },
        ],
        imgSrc: { type: String, required: true },
        imgHoverSrc: { type: String, required: true },
        altText: { type: String },
        size: [
            {
                type: String,
                required: true,
                enum: ["S", "M", "L", "XL", "2XL"],
            },
        ],
        filterCategories: [
            { type: String, required: true, enum: ["Best seller", "On Sale"] },
        ],
        brand: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        description: String,
        soldOut: {
            type: Boolean,
            default: false,
        },
        preOrder: {
            type: Boolean,
            default: false,
        },
        isLookBookProduct: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("products", productSchema);
