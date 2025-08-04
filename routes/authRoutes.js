const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken} = require('../middleware/auth');
const upload = require('../utils/upload');

router.post('/register', upload.single('avatar'), authController.register);
router.post('/login',  authController.login);

router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
