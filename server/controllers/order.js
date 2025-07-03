const asyncHandler = require('express-async-handler');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

require('dotenv').config();

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

const vnpayPayment = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const vnpay = new VNPay({
        tmnCode: '7J44TV0G',
        secureSecret: 'Q3Y714UBR5682PRPEZVVQ4ECVBIN9IT3',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger,
    });

    const now = new Date();
    const expire = new Date(now.getTime() + 15 * 60 * 1000);
    const orderId = Date.now().toString();

    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: req.body.amount,
        vnp_IpAddr: req.ip || '127.0.0.1',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `${_id} Thanh toan don hang #${orderId}`,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: `${process.env.URL_SERVER}/api/order/vnpay-return`,
        vnp_Locale: 'vn',
        vnp_CreateDate: dateFormat(now, 'yyyyMMddHHmmss'),
        vnp_ExpireDate: dateFormat(expire, 'yyyyMMddHHmmss'),
    });

    return res.status(200).json({
        success: true,
        url: vnpayResponse,
    });
});

const vnpayReturn = asyncHandler(async (req, res) => {
    const params = req.query;
    const isSuccess = params.vnp_ResponseCode === '00';
    const amount = Number(params.vnp_Amount || 0) / 100;

    const _id = params.vnp_OrderInfo.split(' ')[0];

    if (isSuccess) {
        const userCart = await User.findById(_id)
            .select('cart')
            .populate('cart.product', 'title price');
        const products = userCart?.cart.map(el => ({
            product: el.product._id,
            count: el.quantity,
        }));
        let total = userCart?.cart.reduce((acc, el) => acc + el.product.price * el.quantity, 0);
        const rs = await Order.create({ products, total, orderBy: _id, status: 'Successed' });
        await User.updateOne({ _id }, { $set: { cart: [] } });
    }

    return res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Kết quả thanh toán</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: system-ui, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f2f2f2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 90%;
                    width: 400px;
                }
                h2 {
                    font-size: 22px;
                    margin-bottom: 12px;
                }
                .success {
                    color: #16a34a;
                }
                .fail {
                    color: #dc2626;
                }
                .amount {
                    font-size: 18px;
                    margin: 10px 0;
                    font-weight: 500;
                }
                .txn {
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 20px;
                }
                a {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #2563eb;
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                }
                @media (max-width: 480px) {
                    .container {
                        width: 90%;
                        padding: 20px;
                    }
                    h2 {
                        font-size: 18px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 class="${isSuccess ? 'success' : 'fail'}">
                    ${isSuccess ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại'}
                </h2>

                ${
                    isSuccess
                        ? `<div class="amount">Số tiền: <strong>${amount.toLocaleString(
                              'vi-VN'
                          )}₫</strong></div>`
                        : ''
                }

                <div class="txn">Mã giao dịch: <strong>${
                    params.vnp_TxnRef || 'Không có'
                }</strong></div>

                <a href="http://localhost:5173/">Quay về trang chủ</a>
            </div>
        </body>
        </html>
    `);
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
    getOrderInMonth,
    vnpayPayment,
    vnpayReturn,
};
