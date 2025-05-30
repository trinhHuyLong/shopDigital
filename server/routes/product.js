const router = require('express').Router();
const productController = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verify');
const uploader = require('../config/cloudinary.config');

router.get('/', productController.getProducts);
router.get('/dealdaily', productController.dealdailyProduct);
router.get('/:pid', productController.getProduct);
router.post(
    '/',
    [verifyAccessToken, isAdmin],
    uploader.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 },
    ]),
    productController.createProduct
);
router.put(
    '/update/:pid',
    [verifyAccessToken, isAdmin],
    uploader.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 },
    ]),
    productController.updateProduct
);
router.put(
    '/uploadImage/:pid',
    [verifyAccessToken, isAdmin],
    uploader.array('images', 10),
    productController.uploadImagesProduct
);
router.put('/rating', verifyAccessToken, productController.ratings);
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct);

module.exports = router;
