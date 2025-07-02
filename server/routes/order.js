const router = require('express').Router();
const orderController = require('../controllers/order');
const { verifyAccessToken, isAdmin } = require('../middlewares/verify');

router.get('/', verifyAccessToken, orderController.getUserOrder);
router.get('/orderinmonth', verifyAccessToken, isAdmin, orderController.getOrderInMonth);
router.get('/admin', verifyAccessToken, isAdmin, orderController.getOrders);
router.post('/create', verifyAccessToken, orderController.createOrder);
router.put('/status/:oid', verifyAccessToken, isAdmin, orderController.updateStatus);
router.post('/payment', verifyAccessToken, orderController.vnpayPayment);
router.get('/vnpay-return', orderController.vnpayReturn);

module.exports = router;
