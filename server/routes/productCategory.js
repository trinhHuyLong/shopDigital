const router = require('express').Router();
const productCategoryController = require('../controllers/productCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verify');
const uploader = require('../config/cloudinary.config');

router.post(
    '/',
    [verifyAccessToken, isAdmin],
    uploader.fields([{ name: 'image', maxCount: 1 }]),
    productCategoryController.createProductCategory
);
router.get('/', productCategoryController.getProductCategories);
router.put(
    '/:pcid',
    [verifyAccessToken, isAdmin],
    uploader.fields([{ name: 'image', maxCount: 1 }]),
    productCategoryController.updateProductCategory
);
router.delete(
    '/:pcid',
    [verifyAccessToken, isAdmin],
    productCategoryController.deleteProductCategory
);

module.exports = router;
