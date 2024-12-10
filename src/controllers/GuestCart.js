const { GuestCart, Product } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");

// Get guest cart
exports.getGuestCart = async (req, res) => {
    try {
        const { guestId } = req.params;
        const cart = await GuestCart.findOne({ guestId }).populate(
            "items.product"
        );

        if (!cart) {
            return responseFormatter(res, true, "Cart is empty", {
                items: [],
                total: 0,
            });
        }

        return responseFormatter(
            res,
            true,
            "Cart retrieved successfully",
            cart
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error retrieving cart",
            null,
            error
        );
    }
};

// Add item to guest cart
exports.addToGuestCart = async (req, res) => {
    try {
        const { guestId } = req.params;
        const { productSlug, quantity, color, size } = req.body;

        console.log("productSlug", productSlug);
        console.log("quantity", quantity);
        console.log("color", color);
        console.log("size", size);
        console.log("guestId", guestId);

        const product = await Product.findOne({ slug: productSlug });
        if (!product) {
            return responseFormatter(res, false, "Product not found");
        }

        let cart = await GuestCart.findOne({ guestId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new GuestCart({
                guestId,
                items: [
                    {
                        product: product._id,
                        quantity,
                        color,
                        size,
                    },
                ],
                total: product.price * quantity,
            });
        } else {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.product.toString() === product._id.toString() &&
                    item.color.name === color.name &&
                    item.size === size
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    product: product._id,
                    quantity,
                    color,
                    size,
                });
            }

            cart.total = cart.items.reduce((acc, item) => {
                return acc + item.quantity * product.price;
            }, 0);
        }

        await cart.save();
        return responseFormatter(
            res,
            true,
            "Item added to cart successfully",
            cart
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error adding item to cart",
            null,
            error
        );
    }
};

// Update guest cart item
exports.updateGuestCartItem = async (req, res) => {
    try {
        const { guestId } = req.params;
        const { itemId, quantity } = req.body;

        const cart = await GuestCart.findOne({ guestId });
        console.log(cart);
        if (!cart) {
            return responseFormatter(res, false, "Cart not found");
        }

        console.log(itemId);

        const itemIndex = cart.items.findIndex(
            (item) => item._id.toString() === itemId
        );

        console.log(itemIndex);
        if (itemIndex === -1) {
            return responseFormatter(res, false, "Item not found in cart");
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total
        const product = await Product.findById(cart.items[itemIndex].product);
        cart.total = cart.items.reduce((acc, item) => {
            return acc + item.quantity * product.price;
        }, 0);

        await cart.save();
        return responseFormatter(res, true, "Cart updated successfully", cart);
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error updating cart",
            null,
            error
        );
    }
};

// Remove item from guest cart
exports.removeFromGuestCart = async (req, res) => {
    try {
        const { guestId, itemId } = req.params;
        console.log("guestId", guestId);
        console.log("itemId", itemId);
        const cart = await GuestCart.findOne({ guestId });
        console.log("cart", cart);
        if (!cart) {
            return responseFormatter(res, false, "Cart not found");
        }

        cart.items = cart.items.filter(
            (item) => item._id.toString() !== itemId
        );
        // Recalculate total
        const products = await Product.find({
            _id: { $in: cart.items.map((item) => item.product) },
        });

        cart.total = cart.items.reduce((acc, item) => {
            const product = products.find(
                (p) => p._id.toString() === item.product.toString()
            );
            return acc + item.quantity * product.price;
        }, 0);

        await cart.save();
        // return cart after removing item
        const updatedCart = await GuestCart.findOne({ guestId });
        console.log("updatedCart", updatedCart);
        return responseFormatter(
            res,
            true,
            "Item removed from cart successfully",
            updatedCart
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error removing item from cart",
            null,
            error
        );
    }
};

// Remove item from guest cart by index
exports.removeItemFromGuestCartByIndex = async (req, res) => {
    try {
        const { guestId, itemIndex } = req.params;
        console.log("guestId", guestId);
        const cart = await GuestCart.findOne({ guestId });
        if (!cart) {
            return responseFormatter(res, false, "Cart not found");
        }
        cart.items.splice(itemIndex, 1);
        // update total
        const products = await Product.find({
            _id: { $in: cart.items.map((item) => item.product) },
        });
        cart.total = cart.items.reduce((acc, item) => {
            const product = products.find(
                (p) => p._id.toString() === item.product.toString()
            );
            return acc + item.quantity * product.price;
        }, 0);
        await cart.save();
        const updatedCart = await GuestCart.findOne({ guestId });
        return responseFormatter(
            res,
            true,
            "Item removed from cart successfully",
            updatedCart
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error removing item from cart",
            null,
            error
        );
    }
};

// Update guest cart item by index
exports.updateGuestCartItemByIndex = async (req, res) => {
    try {
        const { guestId } = req.params;
        const { itemIndex, quantity } = req.body;
        const cart = await GuestCart.findOne({ guestId });
        if (!cart || cart.items.length === 0) {
            return responseFormatter(res, false, "Your cart is empty");
        }
        cart.items[itemIndex].quantity = quantity;
        // update total
        const products = await Product.find({
            _id: { $in: cart.items.map((item) => item.product) },
        });
        cart.total = cart.items.reduce((acc, item) => {
            const product = products.find(
                (p) => p._id.toString() === item.product.toString()
            );
            return acc + item.quantity * product.price;
        }, 0);
        await cart.save();
        const updatedCart = await GuestCart.findOne({ guestId });
        return responseFormatter(
            res,
            true,
            "Item updated successfully",
            updatedCart
        );
    } catch (error) {
        console.log(error);
        return responseFormatter(
            res,
            false,
            "Error updating cart",
            null,
            error
        );
    }
};
