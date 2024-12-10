const { Product } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");
const { Category } = require("../models");
const slugify = require("slugify");

// [GET][/api/product]
module.exports.GET_ReadMany = async (req, res, next) => {
    const products = await Product.find({});
    return responseFormatter(res, true, "Get products successfully", products);
};

// [GET][/api/product/category/:slug]
module.exports.GET_ReadByCategory = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const category = await Category.findOne({ slug });
        if (!category) {
            return responseFormatter(res, false, "Category not found");
        }
        const products = await Product.find({ categoryId: category._id });
        if (!products) {
            console.log(products);
            return responseFormatter(res, false, "Products not found");
        }
        return responseFormatter(
            res,
            true,
            "Get products successfully",
            products
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(res, false, error.message);
    }
};

// [GET][/api/product/:slug]
module.exports.GET_ReadBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({ slug });
        if (!product) {
            return responseFormatter(res, false, "Product not found");
        }
        return responseFormatter(
            res,
            true,
            "Get product successfully",
            product
        );
    } catch (error) {
        return responseFormatter(res, false, error.message);
    }
};

// [POST][/api/product]
module.exports.POST_Create = async (req, res, next) => {
    const productData = req.body;
    console.log(productData);
    productData.slug = slugify(productData.title, { lower: true });
    try {
        // check duplicate title
        const existingTitle = await Product.findOne({
            title: productData.title,
        });
        if (existingTitle) {
            return responseFormatter(res, false, "Title already exists");
        }
        // check duplicate slug
        const existingSlug = await Product.findOne({
            slug: productData.slug,
        });
        if (existingSlug) {
            return responseFormatter(res, false, "Slug already exists");
        }
        const product = await Product.create(productData);
        if (!product) {
            return responseFormatter(res, false, "Create failed");
        }
        return responseFormatter(res, true, product);
    } catch (error) {
        return responseFormatter(res, false, error.message);
    }
};

// [PUT][/api/product/:id]
module.exports.PUT_Update = async (req, res, next) => {
    const _id = req.params.id;
    if (!_id) {
        return responseFormatter(res, false, "Id is required");
    }
    const productData = req.body;
    try {
        let product = await Product.findByIdAndUpdate({ _id }, productData);
        product = await Product.findById({ _id });
        if (!product) {
            return responseFormatter(res, false, `Not found ${_id}`);
        }
        return responseFormatter(
            res,
            true,
            "Update product successfully",
            product
        );
    } catch (error) {
        return responseFormatter(res, false, error.message);
    }
};

// [DELETE][/api/product/:id]
module.exports.DELETE_DeleteById = async (req, res, next) => {
    const _id = req.params.id;
    if (!_id) {
        return responseFormatter(res, false, "Id is required");
    }
    try {
        const product = await Product.deleteOne({ _id });
        if (!product) {
            return responseFormatter(res, false, `Not found ${_id}`);
        }
        return responseFormatter(res, true, "Delete successfully", product);
    } catch (error) {
        return responseFormatter(res, false, error.message);
    }
};
