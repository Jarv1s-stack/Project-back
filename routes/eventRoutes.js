const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');


router.delete('/:id/leave', authenticateToken, eventController.leaveEvent);

router.get('/', eventController.getEvents);


router.get('/:id', eventController.getEventById);


router.post('/', authenticateToken, eventController.createEvent);


router.delete('/:id', authenticateToken, eventController.deleteEvent);


router.post('/:id/join', authenticateToken, eventController.joinEvent);


module.exports = router;
