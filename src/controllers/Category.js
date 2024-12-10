const { Category } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");

// [GET][/api/category]
module.exports.GET_ReadMany = async (req, res, next) => {
    try {
        const categories = await Category.find();
        if (!categories.length) {
            return responseFormatter(res, false, "No categories found");
        }
        return responseFormatter(
            res,
            true,
            "Get categories successfully",
            categories
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};


// [GET][/api/category/:id]
module.exports.GET_ReadbyId = async (req, res, next) => {
    const _id = req.params.id;

    try {
        const category = await Category.findById(_id);
        if (!category) {
            return responseFormatter(res, false, "No categories found");
        }
        return responseFormatter(
            res,
            true,
            "Get category successfully",
            category
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};


// [POST][/api/category]
module.exports.POST_Create = async (req, res, next) => {
    try {
        const categoryData = req.body;
        const existingTitle = await Category.findOne({
            title: categoryData.title,
        });
        if (existingTitle) {
            return responseFormatter(res, false, "Title already exists");
        }

        const category = await Category.create(categoryData);
        return responseFormatter(res, true, "Create successfully", category);
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// [PUT][/api/category/:id]
module.exports.PUT_Update = async (req, res, next) => {
    const _id = req.params.id;

    return await Category.findByIdAndUpdate({ _id }, { ...req.body })
        .then((category) => {
            if (!category) {
                return responseFormatter(res, false, `Not found ${id}`);
            }
            return responseFormatter(
                res,
                true,
                "Update successfully",
                category
            );
        })
        .catch((error) => {
            return responseFormatter(
                res,
                false,
                "Internal server error",
                null,
                error
            );
        });
};

// [DELETE][/api/category/:id]
module.exports.DELETE_DeleteById = async (req, res, next) => {
    const _id = req.params.id;
    return await Category.deleteOne({ _id })
        .then(() => {
            return responseFormatter(res, true, "Delete successfully");
        })
        .catch((error) => {
            return responseFormatter(
                res,
                false,
                "Internal server error",
                null,
                error
            );
        });
};
