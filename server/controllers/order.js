const asyncHandler = require('express-async-handler');

const Order = require('../models/order');
const User = require('../models/user');

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const userCart = await User.findById(_id)
        .select('cart')
        .populate('cart.product', 'title price');
    const products = userCart?.cart.map(el => ({
        product: el.product._id,
        count: el.quantity,
    }));
    let total = userCart?.cart.reduce((acc, el) => acc + el.product.price * el.quantity, 0);
    const rs = await Order.create({ products, total, orderBy: _id });
    await User.updateOne({ _id }, { $set: { cart: [] } });
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new Order',
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Status is required');
    const rs = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new Order',
    });
});

const getOrderInMonth = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const quries = {
        createdAt: {
            $gte: startOfMonth,
            $lt: startOfNextMonth,
        },
    };
    if (status) quries.status = status;

    const rs = await Order.find(quries)
        .populate('products.product', 'title thumb price')
        .populate('orderBy', 'name avatar email');
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new Order',
    });
});

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const rs = await Order.find({ orderBy: _id })
        .sort({ createdAt: -1 })
        .populate('products.product', 'title thumb price');
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new Order',
    });
});

const getOrders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const quries = {};
    if (status) quries.status = status;
    const rs = await Order.find(quries)
        .sort({ createdAt: -1 })
        .populate('products.product', 'title thumb price quantity sold')
        .populate('orderBy', 'name avatar email');
    return res.status(201).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new Order',
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
    getOrderInMonth,
};
