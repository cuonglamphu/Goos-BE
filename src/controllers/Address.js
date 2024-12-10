const { Address } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");

// [GET][/api/address]
module.exports.GET_ReadMany = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const addresses = await Address.find({ userId });
        if (!addresses.length) {
            return responseFormatter(res, false, "No addresses found");
        }
        return responseFormatter(
            res,
            true,
            "Get addresses successfully",
            addresses
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// [GET][/api/address/default-address]
module.exports.GET_ReadDefaultAddress = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const address = await Address.findOne({ userId, isDefault: true });
        if (!address) {
            return responseFormatter(
                res,
                false,
                "Default address not is not set"
            );
        }
        return responseFormatter(
            res,
            true,
            "Get default address successfully",
            {
                address,
            }
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// [POST][/api/address]
module.exports.POST_Create = async (req, res, next) => {
    const userId = req.user.id;
    const addressData = ({
        firstName,
        lastName,
        company,
        address,
        city,
        country,
        province,
        postalCode,
        phone,
        isDefault,
    } = req.body);
    console.log("@@addressData", addressData);
    try {
        const address = await Address.create({ ...addressData, userId });
        // Just allow one default address
        if (address.isDefault) {
            await Address.updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
            await address.updateOne({ $set: { isDefault: true } });
        } else {
            await Address.updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
            // Set the new address as default
            await address.updateOne({ $set: { isDefault: true } });
        }
        return responseFormatter(res, true, "Create successfully", address);
    } catch (error) {
        console.log("@@error", error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// [PUT][/api/address/:id]
module.exports.PUT_Update = async (req, res, next) => {
    const _id = req.params.id;
    const userId = req.user.id;

    const addressData = req.body;

    try {
        let address = await Address.findOneAndUpdate(
            { _id, userId },
            addressData
        );
        address = await Address.findOne({ _id, userId });
        if (!address) {
            return responseFormatter(res, false, `Not found ${_id}`);
        }
        if (address.isDefault) {
            await Address.updateMany(
                { userId },
                { $set: { isDefault: false } }
            );
            await address.updateOne({ $set: { isDefault: true } });
        }
        return responseFormatter(res, true, "Update successfully", address);
    } catch (error) {
        console.log("@@error", error);
        return responseFormatter(
            res,
            false,
            "Internal server error",
            null,
            error
        );
    }
};

// [DELETE][/api/address/:id]
module.exports.DELETE_DeleteById = async (req, res, next) => {
    const _id = req.params.id;
    const userId = req.user.id;

    return await Address.deleteOne({ _id, userId })
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
