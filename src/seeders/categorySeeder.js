const mongoose = require("mongoose");
const Category = require("../models/Category");

const categoryData = [
    {
        title: "Man",
        imgSrc: "https://hmveston.vn/wp-content/uploads/2021/05/ao-xam-1-nut-2.jpg",
        altText: "Man Category",
        itemCount: "100",
        slug: "man",
    },
    {
        title: "Women",
        imgSrc: "https://diuhien.vn/wp-content/uploads/2020/05/cac-mau-dam-dep-2020-1-5.jpg",
        altText: "Women Category",
        itemCount: "120",
        slug: "women",
    },
    {
        title: "Sportswear",
        imgSrc: "https://eu-images.contentstack.com/v3/assets/bltba21507b68af827e/blt66d1be817a9fbda8/656071b090f1a8040aebc3da/New_Year_Reset_Hero_Module_DG_Mobile.jpg",
        altText: "Sportswear Category",
        itemCount: "70",
        slug: "sportswear",
    },
    {
        title: "Kids",
        imgSrc: "https://tse2.mm.bing.net/th?id=OIP.RuuuzQJ2jI00BVB-GKrNtwHaHa",
        altText: "Kids Category",
        itemCount: "80",
        slug: "kids",
    },
];

const seedCategories = async () => {
    try {
        // Xóa tất cả categories hiện có
        await Category.deleteMany({});

        // Import dữ liệu mới
        await Category.insertMany(categoryData);

        console.log("Categories seeded successfully");
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
};

module.exports = seedCategories;
