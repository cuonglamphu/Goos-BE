const calculateShippingCost = (items, shippingMethod, address) => {
    const rates = {
        standard: 5.99,
        express: 15.99,
    };

    // Calculate total weight/size based on items
    const totalWeight = items.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    // Add weight-based cost
    let cost = rates[shippingMethod];
    cost += totalWeight * 0.5;

    if (address.country !== "Vietnam") {
        cost *= 1.5;
    }

    return Number(cost.toFixed(2));
};

const getEstimatedDeliveryDate = (shippingMethod) => {
    const today = new Date();
    const deliveryDays = {
        standard: 5,
        express: 2,
    };

    const date = new Date(today);
    date.setDate(date.getDate() + deliveryDays[shippingMethod]);
    return date;
};

module.exports = {
    calculateShippingCost,
    getEstimatedDeliveryDate,
};
