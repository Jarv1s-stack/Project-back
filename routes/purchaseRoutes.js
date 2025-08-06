const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const {authenticateToken} = require('../middleware/auth');


router.post('/buy', authenticateToken, purchaseController.buyItem);


router.get('/my', authenticateToken, purchaseController.getMyPurchases);

module.exports = router;
