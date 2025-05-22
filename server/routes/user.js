const router = require('express').Router();
const userController = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verify');
const uploader = require('../config/cloudinary.config');

router.post('/register', userController.registerUser);
router.put('/finalregister/:token', userController.finalregister);
router.post('/login', userController.loginUser);
router.get('/current', verifyAccessToken, userController.getCurrent);
router.post('/forgot', userController.forgotPassword);
router.put('/resetpassword', userController.resetPassword);
router.get('/', [verifyAccessToken, isAdmin], userController.getUsers);
router.delete('/:uid', [verifyAccessToken, isAdmin], userController.deleteUser);
router.put('/update', [verifyAccessToken], uploader.single('avatar'), userController.updateUser);
router.put('/updateaddress', verifyAccessToken, userController.updateUserAdress);
router.put('/updatecart', verifyAccessToken, userController.updateCart);
router.put('/:uid', [verifyAccessToken, isAdmin], userController.updateUserByAdmin);
router.delete('/remove-cart/:pid', [verifyAccessToken], userController.removeProductInCart);

module.exports = router;
