const router = require('express').Router();
const inserController = require('../controllers/insertdata');

router.post('/', inserController.insertProduct);
router.post('/brand', inserController.insertBrand);

module.exports = router
