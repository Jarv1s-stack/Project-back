const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const {authenticateToken} = require('../middleware/auth');

// Купить товар из магазина
router.post('/buy', authenticateToken, purchaseController.buyItem);

// История покупок пользователя
router.get('/my', authenticateToken, purchaseController.getMyPurchases);

module.exports = router;
