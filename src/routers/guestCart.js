const express = require("express");
const router = express.Router();
const guestCartController = require("../controllers/GuestCart");

router.get("/:guestId", guestCartController.getGuestCart);
router.post("/:guestId", guestCartController.addToGuestCart);
router.put("/:guestId/update", guestCartController.updateGuestCartItem);
router.put(
    "/:guestId/updatebyindex",
    guestCartController.updateGuestCartItemByIndex
);
router.delete(
    "/:guestId/remove/:itemId",
    guestCartController.removeFromGuestCart
);
router.delete(
    "/:guestId/removebyindex/:itemIndex",
    guestCartController.removeItemFromGuestCartByIndex
);

module.exports = router;
