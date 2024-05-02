const router = require('express').Router();
const { signup, login, forgotPassword, resetPassword } = require('../controllers/userControllers');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

module.exports = router;