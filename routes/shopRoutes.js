// backend/routes/shopRoutes.js

const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

router.get("/", shopController.getShopItems);
router.post("/purchase", shopController.purchaseItem);

module.exports = router;
