const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {authenticateToken} = require('../middleware/auth');

// Получить все сообщения события
router.get('/:eventId', authenticateToken, messageController.getMessages);

// Отправить сообщение в событие
router.post('/:eventId', authenticateToken, messageController.sendMessage);

module.exports = router;
