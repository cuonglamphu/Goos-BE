const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        company: String,
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            default: "Vietnam",
            enum: [
                "Vietnam",
                "United States",
                "Canada",
                "United Kingdom",
                "Australia",
                "New Zealand",
                "Other",
            ],
        },
        province: String,
        postalCode: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("address", addressSchema);
