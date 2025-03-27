const asyncHandler = require('express-async-handler')

const ProductCategory = require('../models/productCategory')

const createProductCategory = asyncHandler(async (req, res) => {
    const respone = await ProductCategory.create(req.body)
    return res.status(201).json({
        success: respone? true: false,
        createdCategory: respone?respone: 'Cannot create new product category'
    })
})

const getProductCategories = asyncHandler(async (req, res) => {
    const respone = await ProductCategory.find().select('title _id')
    return res.status(201).json({
        success: respone? true: false,
        prodCategory: respone?respone: 'Cannot get product category'
    })
})

const updateProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const respone = await ProductCategory.findByIdAndUpdate(pcid,req.body,{new:true})
    return res.status(201).json({
        success: respone? true: false,
        updateProdCategory: respone?respone: 'Cannot update product category'
    })
})

const deleteProductCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const respone = await ProductCategory.findByIdAndDelete(pcid)
    return res.status(201).json({
        success: respone? true: false,
        deleteProdCategory: respone?respone: 'Cannot delete product category'
    })
})

module.exports = {
    createProductCategory,
    getProductCategories,
    updateProductCategory,
    deleteProductCategory
}