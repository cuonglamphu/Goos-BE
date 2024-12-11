const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const seedProducts = async () => {
    try {
        // Lấy categories đã được seed
        const categories = await Category.find();
        console.log("Found categories:", categories);

        if (!categories.length) {
            throw new Error("Categories must be seeded first");
        }

        // Map categoryIds
        const categoryMap = {
            man: categories.find((c) => c.slug === "man")._id,
            women: categories.find((c) => c.slug === "women")._id,
            sportswear: categories.find((c) => c.slug === "sportswear")._id,
            kids: categories.find((c) => c.slug === "kids")._id,
        };

        console.log("Category mapping:", categoryMap);

        const productData = [
            // MAN CATEGORY
            {
                categoryId: categoryMap.man,
                slug: "man-casual-shirt",
                title: "Casual Shirt",
                oldPrice: 500,
                price: 450,
                colours: [
                    {
                        name: "Red",
                        colorClass: "bg-danger",
                        imgSrc: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/478929/item/vngoods_17_478929_3x4.jpg?width=369",
                        oldPrice: 5000,
                        price: 450000,
                    },
                ],
                imgSrc: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/470190002/item/vngoods_56_470190002_3x4.jpg?width=369",
                imgHoverSrc:
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/470188001/item/vngoods_09_470188001_3x4.jpg?width=369",
                altText: "A casual shirt for men",
                size: ["M", "L", "XL"],
                filterCategories: ["Best seller"],
                brand: "Brand A",
                description: "A comfortable casual shirt for daily wear.",
                soldOut: false,
                preOrder: false,
                isLookBookProduct: false,
            },
            {
                categoryId: categoryMap.man,
                slug: "slim-jeans",
                title: "Slim Jeans",
                oldPrice: 800,
                price: 699,
                colours: [
                    {
                        name: "Black",
                        colorClass: "bg-dark",
                        imgSrc: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F94%2Fa3%2F94a39c3a1cfb47645fb4791a881d08cd86f6a3c2.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
                        oldPrice: 800,
                        price: 699,
                    },
                ],
                imgSrc: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F1c%2Fd9%2F1cd9bed25fea27e1655592a74a9778049298561e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
                imgHoverSrc:
                    "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F1c%2Fd9%2F1cd9bed25fea27e1655592a74a9778049298561e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
                altText: "Slim Jeans",
                size: ["L", "XL", "2XL"],
                filterCategories: ["Best seller"],
                brand: "Brand A",
                description:
                    "5-pocket jeans in cotton denim with a slight stretch for comfort. Straight leg and slim fit from waistband to hem.",
                soldOut: false,
                preOrder: false,
                isLookBookProduct: false,
            },

            // WOMEN CATEGORY
            {
                categoryId: categoryMap.women,
                slug: "women-evening-dress",
                title: "Evening Dress",
                price: 120,
                colours: [
                    {
                        name: "Red",
                        colorClass: "bg-danger",
                        imgSrc: "https://images.asos-media.com/products/asos-design-angel-sleeve-sequin-mini-dress-with-low-back-in-burgundy/207611851-1-burgundy?$n_320w$&wid=317&fit=constrain",
                        price: 120,
                    },
                ],
                imgSrc: "https://images.asos-media.com/products/asos-design-angel-sleeve-sequin-mini-dress-with-low-back-in-gold/207465628-4?$n_240w$&wid=40&fit=constrain",
                imgHoverSrc:
                    "https://images.asos-media.com/products/asos-design-angel-sleeve-sequin-mini-dress-with-low-back-in-gold/207465628-1-gold?$n_240w$&wid=40&fit=constrain",
                altText: "Elegant evening dress for women",
                size: ["S", "M", "L"],
                filterCategories: ["On Sale"],
                brand: "Brand B",
                description: "An elegant dress perfect for special occasions.",
                soldOut: false,
                preOrder: false,
                isLookBookProduct: true,
                oldPrice: 500,
            },

            // SPORTSWEAR CATEGORY
            {
                categoryId: categoryMap.sportswear,
                slug: "drymovetm-sports-shirt",
                title: "DryMove™ Sports Shirt",
                oldPrice: 449,
                price: 250,
                colours: [
                    {
                        name: "Orange",
                        colorClass: "bg-danger",
                        imgSrc: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fe8%2F75%2Fe8752d67e9d56fc655dfbb359d2ca94bf08bceec.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeve%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
                        oldPrice: 450,
                        price: 250,
                    },
                ],
                imgSrc: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F95%2Ffa%2F95faf98c3f8b7323a0f9115bcd229626248a1fec.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeve%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
                imgHoverSrc:
                    "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F95%2Ffa%2F95faf98c3f8b7323a0f9115bcd229626248a1fec.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_tshirtstanks_shortsleeve%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
                altText: "DryMove™ Sports Shirt",
                size: ["S", "M", "L", "XL", "2XL"],
                filterCategories: ["Best seller"],
                brand: "Brand A",
                description:
                    "DryMove™ activewear pullover wicks moisture away from the skin to keep you dry and comfortable as you move.",
                soldOut: false,
                preOrder: false,
                isLookBookProduct: false,
            },
        ];

        // Log before deletion
        const beforeCount = await Product.countDocuments();
        console.log("Products before deletion:", beforeCount);

        // Xóa tất cả products hiện có
        await Product.deleteMany({});

        // Log after deletion
        const afterDeleteCount = await Product.countDocuments();
        console.log("Products after deletion:", afterDeleteCount);

        // Import dữ liệu mới
        const inserted = await Product.insertMany(productData);
        console.log(`Inserted ${inserted.length} products`);

        // Verify insertion
        const finalCount = await Product.countDocuments();
        console.log("Final product count:", finalCount);
    } catch (error) {
        console.error("Error seeding products:", error);
        // Log detailed error
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                console.error(
                    `Validation error for ${key}:`,
                    error.errors[key].message
                );
            });
        }
    }
};

module.exports = seedProducts;
