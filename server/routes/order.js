const router = require('express').Router();
const orderController = require('../controllers/order');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.get('/', verifyAccessToken, orderController.getUserOrder);
router.get('/admin', verifyAccessToken,isAdmin, orderController.getUserOrder);
router.post('/create', verifyAccessToken, orderController.createOrder);
router.post('/status/:oid', verifyAccessToken,isAdmin, orderController.updateStatus);

module.exports = router