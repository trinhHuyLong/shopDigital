const asyncHandler = require('express-async-handler')

const Brand = require('../models/brand')

const createNewBrand = asyncHandler(async (req, res) => {
    const respone = await Brand.create(req.body)
    return res.status(201).json({
        success: respone? true: false,
        createdNewBrand: respone?respone: 'Cannot create new Brand'
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const respone = await Brand.find()
    return res.status(201).json({
        success: respone? true: false,
        brands: respone?respone: 'Cannot get Brands'
    })
})

const updateBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const respone = await Brand.findByIdAndUpdate(bid,req.body,{new:true})
    return res.status(201).json({
        success: respone? true: false,
        updateBrand: respone?respone: 'Cannot update Brand'
    })
})

const deleteBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const respone = await Brand.findByIdAndDelete(bid)
    return res.status(201).json({
        success: respone? true: false,
        deleteBrand: respone?respone: 'Cannot delete Brand'
    })
})

module.exports = {
    createNewBrand,
    getBrands,
    updateBrand,
    deleteBrand,

}