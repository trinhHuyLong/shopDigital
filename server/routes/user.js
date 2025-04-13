const router = require('express').Router();
const userController = require('../controllers/user');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/current', verifyAccessToken, userController.getCurrent);
router.post('/refresh', userController.refreshToken); 
router.get('/logout', userController.logout); 
router.post('/forgot', userController.forgotPassword);
router.post('/resetpassword', userController.resetPassword);
router.get('/',[verifyAccessToken,isAdmin], userController.getUsers);
router.delete('/delete',[verifyAccessToken,isAdmin], userController.deleteUser);
router.post('/update',[verifyAccessToken], userController.updateUser);
router.put('/updateaddress',verifyAccessToken, userController.updateUserAdress);
router.put('/updatecart',verifyAccessToken, userController.updateCart);
router.put('/:uid',[verifyAccessToken,isAdmin], userController.updateUserByAdmin);

module.exports = router