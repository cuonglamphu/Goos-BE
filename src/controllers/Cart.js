const { Cart, Product } = require("../models");
const { responseFormatter } = require("../utils/responseFormatter");

// Get cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate(
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

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productSlug, quantity = 1, colorIndex, sizeIndex } = req.body;

        // Validate required fields
        if (
            !productSlug ||
            colorIndex === undefined ||
            sizeIndex === undefined
        ) {
            return responseFormatter(res, false, "Missing required fields");
        }

        // Validate product exists
        const product = await Product.findOne({ slug: productSlug });
        if (!product) {
            return responseFormatter(res, false, "Product not found");
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({
                userId: req.user.id,
                items: [
                    {
                        product: product._id,
                        quantity: Number(quantity),
                        color: {
                            name: product.colours[colorIndex]?.name,
                        },
                        size: product.size[sizeIndex],
                    },
                ],
                total: Number(product.price) * Number(quantity),
            });
        } else {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex(
                (item) =>
                    item.product.toString() === product._id.toString() &&
                    item.color.name === product.colours[colorIndex]?.name &&
                    item.size === product.size[sizeIndex]
            );

            if (itemIndex > -1) {
                // Update existing item quantity
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                // Add new item
                cart.items.push({
                    product: product._id,
                    quantity: Number(quantity),
                    color: {
                        name: product.colours[colorIndex]?.name,
                    },
                    size: product.size[sizeIndex],
                });
            }

            // Recalculate total using product prices from database
            cart.total = cart.items.reduce((acc, item) => {
                return acc + Number(item.quantity) * Number(product.price);
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
        console.error("Add to cart error:", error);
        return responseFormatter(
            res,
            false,
            "Error adding item to cart",
            null,
            error
        );
    }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return responseFormatter(res, false, "Cart not found");
        }

        const itemIndex = cart.items.findIndex(
            (item) => item._id.toString() === itemId
        );
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

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId: req.user.id });
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
        return responseFormatter(
            res,
            true,
            "Item removed from cart successfully",
            cart
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error removing item from cart",
            null,
            error
        );
    }
};

// Remove item from cart by index
exports.removeItemFromCartByIndex = async (req, res) => {
    try {
        const { itemIndex } = req.params;
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return responseFormatter(res, false, "Cart not found");
        }
        cart.items.splice(itemIndex, 1);
        // calculate total
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
        const updatedCart = await Cart.findOne({ userId: req.user.id });
        return responseFormatter(
            res,
            true,
            "Item removed from cart successfully",
            updatedCart
        );
    } catch (error) {
        return responseFormatter(
            res,
            false,
            "Error removing item from cart",
            null,
            error
        );
    }
};

// Update cart item by index
exports.updateCartItemByIndex = async (req, res) => {
    try {
        const { itemIndex, quantity } = req.body;
        console.log(itemIndex, quantity);
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart || cart.items.length === 0) {
            return responseFormatter(res, false, "Your cart is empty");
        }

        const product = await Product.findById(cart.items[itemIndex].product);
        cart.total = cart.items.reduce((acc, item) => {
            return acc + item.quantity * product.price;
        }, 0);
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        const updatedCart = await Cart.findOne({ userId: req.user.id });
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
