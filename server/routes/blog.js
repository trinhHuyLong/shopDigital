const router = require('express').Router();
const blogController = require('../controllers/blog');
const { verifyAccessToken,isAdmin } = require('../middlewares/verify');
const uploader  = require('../config/cloudinary.config');

router.get('/', blogController.getBlogs);
router.get('/:bid', blogController.getBlog);
router.post('/',[ verifyAccessToken,isAdmin], blogController.createNewBlog);
router.put('/update/:bid',[ verifyAccessToken,isAdmin], blogController.updateBlog);
router.put('/uploadImage/:bid',[ verifyAccessToken,isAdmin],uploader.single('image') , blogController.uploadImagesBlog);
router.put('/like/:bid',[ verifyAccessToken], blogController.likeBlog);
router.put('/dislike/:bid',[ verifyAccessToken], blogController.disLikeBlog);
router.delete('/:bid',[ verifyAccessToken,isAdmin], blogController.deleteBlog);

module.exports = router
