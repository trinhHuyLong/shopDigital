const router = require('express').Router();
const inserController = require('../controllers/insertdata');

router.post('/', inserController.insertProduct);

module.exports = router
