const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        title: String,
        imgSrc: String,
        altText: String,
        itemCount: String,
        slug: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("categories", categorySchema);
