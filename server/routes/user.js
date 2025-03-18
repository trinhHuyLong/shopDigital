const router = require('express').Router();
const userController = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verify');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/current', verifyAccessToken, userController.getCurrent);

module.exports = router