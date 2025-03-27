const router = require('express').Router();
const blogCategoryController = require('../controllers/blogCategory');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');

router.post('/',[verifyAccessToken,isAdmin], blogCategoryController.createBlogCategory);
router.get('/', blogCategoryController.getBlogCategories);
router.put('/:bcid',[verifyAccessToken,isAdmin], blogCategoryController.updateBlogCategory);
router.delete('/:bcid',[verifyAccessToken,isAdmin], blogCategoryController.deleteBlogCategory);

module.exports = router