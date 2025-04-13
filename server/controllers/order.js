const asyncHandler = require('express-async-handler')

const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')

const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }))
    let total = userCart?.cart.reduce((acc, el) => acc + (el.product.price * el.quantity), 0)
    if(coupon) {
        const selectedCoupon = await Coupon.findById(coupon) 
        total = Math.round(total*(1 - +selectedCoupon?.discount/100)/1000)*1000 || total
    }
    const rs = await Order.create({products, total, orderBy: _id})
    return res.status(201).json({
        success: rs? true: false,
        rs: rs?rs: 'Cannot create new Order',
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const {oid} = req.params
    const {status} = req.body
    if(!status) throw new Error('Status is required')
    const rs = await Order.findByIdAndUpdate(oid, {status}, {new: true})
    return res.status(201).json({
        success: rs? true: false,
        rs: rs?rs: 'Cannot create new Order',
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const rs = await Order.find({orderBy: _id})
    return res.status(201).json({
        success: rs? true: false,
        rs: rs?rs: 'Cannot create new Order',
    })
})

const getOrders = asyncHandler(async (req, res) => {
    const rs = await Order.find({})
    return res.status(201).json({
        success: rs? true: false,
        rs: rs?rs: 'Cannot create new Order',
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders
}