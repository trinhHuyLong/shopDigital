const asyncHandler = require('express-async-handler')

const BlogCategory = require('../models/blogCategory')

const createBlogCategory = asyncHandler(async (req, res) => {
    const respone = await BlogCategory.create(req.body)
    return res.status(201).json({
        success: respone? true: false,
        createdCategory: respone?respone: 'Cannot create new Blog category'
    })
})

const getBlogCategories = asyncHandler(async (req, res) => {
    const respone = await BlogCategory.find().select('title _id')
    return res.status(201).json({
        success: respone? true: false,
        blogCategory: respone?respone: 'Cannot get Blog category'
    })
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const respone = await BlogCategory.findByIdAndUpdate(bcid,req.body,{new:true})
    return res.status(201).json({
        success: respone? true: false,
        updateBlogCategory: respone?respone: 'Cannot update Blog category'
    })
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const respone = await BlogCategory.findByIdAndDelete(bcid)
    return res.status(201).json({
        success: respone? true: false,
        deleteBlogCategory: respone?respone: 'Cannot delete Blog category'
    })
})

module.exports = {
    createBlogCategory,
    getBlogCategories,
    updateBlogCategory,
    deleteBlogCategory
}