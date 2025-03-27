const router = require('express').Router();
const productCategoryController = require('../controllers/productCategory');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.post('/',[verifyAccessToken,isAdmin], productCategoryController.createProductCategory);
router.get('/', productCategoryController.getProductCategories);
router.put('/:pcid',[verifyAccessToken,isAdmin], productCategoryController.updateProductCategory);
router.delete('/:pcid',[verifyAccessToken,isAdmin], productCategoryController.deleteProductCategory);

module.exports = router