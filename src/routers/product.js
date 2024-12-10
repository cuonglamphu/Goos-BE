const { productController } = require("../controllers");
const express = require("express");
const router = express.Router();

router.post("/", productController.POST_Create);
router.get("/", productController.GET_ReadMany);
router.put("/:id", productController.PUT_Update);
router.delete("/:id", productController.DELETE_DeleteById);
router.get("/:slug", productController.GET_ReadBySlug);
router.get("/category/:slug", productController.GET_ReadByCategory);
module.exports = router;
