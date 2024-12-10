const { categoryController } = require("../controllers");
const express = require("express");
const router = express.Router();

router.get("/", categoryController.GET_ReadMany);
router.get("/:id", categoryController.GET_ReadbyId);
router.post("/", categoryController.POST_Create);
router.put("/:id", categoryController.PUT_Update);
router.delete("/:id", categoryController.DELETE_DeleteById);

module.exports = router;
