const router = require('express').Router();
const productController = require('../controllers/product');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.get('/:pid', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/update/:pid',[verifyAccessToken,isAdmin], productController.updateProduct);
router.post('/',[verifyAccessToken,isAdmin], productController.createProduct);
router.put('/rating',verifyAccessToken,productController.ratings)
router.delete('/:pid',[verifyAccessToken,isAdmin], productController.deleteProduct);

module.exports = router