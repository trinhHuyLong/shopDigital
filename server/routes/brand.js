const router = require('express').Router();
const brandController = require('../controllers/brand');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.post('/',[verifyAccessToken,isAdmin], brandController.createNewBrand);
router.get('/', brandController.getBrands);
router.put('/:bid',[verifyAccessToken,isAdmin], brandController.updateBrand);
router.delete('/:bid',[verifyAccessToken,isAdmin], brandController.deleteBrand);

module.exports = router