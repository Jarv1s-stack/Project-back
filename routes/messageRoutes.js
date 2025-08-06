const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticateToken} = require('../middleware/auth');


router.get('/:eventId', authenticateToken, messageController.getMessages);


router.post('/:eventId', authenticateToken, messageController.sendMessage);

module.exports = router;
