const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticateToken} = require('../middleware/auth');




router.post('/change-password', authenticateToken, userController.changePassword);

module.exports = router;


router.get('/:id/points', authenticateToken, userController.getPoints);

router.get('/me', authenticateToken, userController.getMyProfile);

router.get('/other/:id', authenticateToken, userController.getOtherProfile);


module.exports = router;
