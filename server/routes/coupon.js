const router = require('express').Router();
const couponController = require('../controllers/coupon');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.get('/', couponController.getCoupons);
router.post('/',[ verifyAccessToken,isAdmin], couponController.createNewCoupon);
router.put('/update/:cid',[ verifyAccessToken,isAdmin], couponController.updateCoupon);
router.delete('/delete/:cid',[ verifyAccessToken,isAdmin], couponController.deleteCoupon);

module.exports = router
