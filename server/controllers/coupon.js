const asyncHandler = require('express-async-handler')

const Coupon = require('../models/coupon')

const createNewCoupon = asyncHandler(async (req, res) => {
    const {name, discount, expiry} = req.body
    if(!name ||!discount ||!expiry) throw new Error('Missing input')
    const respone = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry*24*60*60*1000
     })
    return res.status(201).json({
        success: respone? true: false,
        createdBlog: respone?respone: 'Cannot create new coupon'
    })
})

const getCoupons = asyncHandler(async (req, res) => {
    const respone = await Coupon.find().select('-updatedAt -createdAt')
    return res.status(201).json({
        success: respone? true: false,
        coupons: respone?respone: 'Cannot get coupons'
    })
})

const updateCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params
    if(Object.keys(req.body).length===0) throw new Error('Missing input')
    if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry*24*60*60*1000
    const respone = await Coupon.findByIdAndUpdate(cid,req.body,{new:true})
    return res.status(201).json({
        success: respone? true: false,
        updateCoupon: respone?respone: 'Cannot update coupon'
    })
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const {cid} = req.params
    const respone = await Coupon.findByIdAndDelete(cid)
    return res.status(200).json({
        success: respone? true: false,
        deleteCoupon: respone? respone: 'Cannot delete coupon'
    })
})

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
}