const asyncHandler = require('express-async-handler')

const Blog = require('../models/blog')

const createNewBlog = asyncHandler(async (req, res) => {
    const {title, description, category} = req.body
    if(!title ||!description ||!category) throw new Error('Missing input')
    const respone = await Blog.create(req.body)
    return res.status(201).json({
        success: respone? true: false,
        createdBlog: respone?respone: 'Cannot create new Blog'
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing input')
    const respone = await Blog.findByIdAndUpdate(bid,req.body,{new:true})
    return res.status(201).json({
        success: respone? true: false,
        createdBlog: respone?respone: 'Cannot update Blog'
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const respone = await Blog.find()
    return res.status(201).json({
        success: respone? true: false,
        createdBlog: respone?respone: 'Cannot get Blogs'
    })
})

const likeBlog = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('Missing input')
    const blog = await Blog.findById(bid)
    const alreadyDisLiked = blog?.disLikes?.find(el => el.toString() === _id)
    if(alreadyDisLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {disLikes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }

    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if(isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }
})

const disLikeBlog = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('Missing input')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.Likes?.find(el => el.toString() === _id)
    if(alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }

    const isDisLiked = blog?.disLikes?.find(el => el.toString() === _id)
    if(isDisLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {disLikes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: {disLikes: _id}},{new: true})
        return res.status(201).json({
            success: response? true: false,
            rs: response
        })
    }
})

const excludeFields = '-refreshToken -password -createdAt -updatedAt'

const getBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const respone = await Blog.findByIdAndUpdate(bid, {$inc :{numberViews: 1}}, {new: true}).populate('likes', 'firstname lastname').populate('disLikes', 'firstname lastname')
    return res.status(201).json({
        success: respone? true: false,
        rs: respone?respone: 'Cannot get Blogs'
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const respone = await Blog.findByIdAndDelete(bid)
    return res.status(201).json({
        success: respone? true: false,
        rs: respone?respone: 'Cannot delete Blogs'
    })
})

const uploadImagesBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if(!req.file) throw new Error('No file uploaded')
    const respone = await Blog.findByIdAndUpdate(bid, {image: req.file.path}, {new: true})
    return res.json({
        success: respone? true: false,
        message: respone? 'Images uploaded successfully' : 'Cannot upload images'
    })
})


module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    getBlog,
    likeBlog,
    disLikeBlog,
    deleteBlog,
    uploadImagesBlog
}