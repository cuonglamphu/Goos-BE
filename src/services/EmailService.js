const transporter = require("../config/transporter");
const Product = require("../models/Product");
const sendWelcomeEmail = async (email, password, existingEmail = null) => {
    let emailContent;
    if (existingEmail) {
        emailContent = {
            to: existingEmail,
            subject: "Welcome to our store",
            html: `
                <h1>Thanks for checking out our store</h1>
                <p>You can use temporary account and password to login and checking your order status</p>
                <p>Your temporary account is: ${email}</p>
                <p>Your temporary password is: ${password}</p>
                <p>You can change your password after logging in</p>
            `,
        };
    } else {
        emailContent = {
            to: email,
            subject: "Welcome to our store",
            html: `
                <h1>Welcome to our store</h1>
                <p>You can use this account and password to login and checking your order status</p>
                <p>Your account is: ${email}</p>
                <p>Your password is: ${password}</p>
                <p>You can change your password after logging in</p>
            `,
        };
    }
    try {
        await transporter.sendMail(emailContent);
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

const sendOrderConfirmation = async (order, email) => {
    const emailContent = {
        to: email,
        subject: `Order Confirmation #${order.orderNumber}`,
        html: `
            <h1>Thank you for your order!</h1>
            <p>Order Number: ${order.orderNumber}</p>
            <p>Total: $${order.total}</p>
            <p>Estimated Delivery: ${order.estimatedDeliveryDate.toLocaleDateString()}</p>
            <!-- Add more order details -->
        `,
    };

    await transporter.sendMail(emailContent);
};

const sendOrderStatusUpdate = async (order, email) => {
    const emailContent = {
        to: email,
        subject: `Order Status Update #${order.orderNumber}`,
        html: `
            <h1>Your Order Status Has Been Updated</h1>
            <p>Order Number: ${order.orderNumber}</p>
            <p>New Status: ${order.status}</p>
            <!-- Add more details -->
        `,
    };

    await transporter.sendMail(emailContent);
};

const getProductDetails = async (productId) => {
    console.log("productId", productId);
    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product not found");
        return null;
    }
    console.log("product", product);
    return product;
};

const sendOrderConfirmationEmail = async (user, order, items) => {
    // Get all product details first
    const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
            const product = await getProductDetails(item.product);
            return {
                ...item,
                product,
            };
        })
    );

    const emailContent = {
        to: user.email,
        subject: `Order Confirmation #${order.orderNumber}`,
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 3px solid #4CAF50;">
                    <h1 style="color: #2E7D32; margin: 0;">Thank you for your order!</h1>
                </div>
                
                <div style="padding: 20px; background-color: white;">
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Order Number:</strong> #${
                            order.orderNumber
                        }</p>
                        <p style="margin: 5px 0;"><strong>Total:</strong> $${order.total.toFixed(
                            2
                        )}</p>
                        <p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryDate.toLocaleDateString()}</p>
                    </div>

                    <h2 style="color: #2E7D32; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Order Details</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Quantity</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsWithProducts
                                .map(
                                    (item) => `
                                    <tr>
                                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product.title}</td>
                                        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${item.quantity}</td>
                                        <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">$ ${item.product.price}</td>    
                                    </tr>
                                `
                                )
                                .join("")}
                        </tbody>
                    </table>

                    <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 5px;">
                        <p style="margin: 0; color: #2E7D32; font-size: 18px;">Thank you for shopping with us!</p>
                    </div>
                </div>
                
                <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
                    <p>If you have any questions, please contact our customer support</p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(emailContent);
};

module.exports = {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
};
