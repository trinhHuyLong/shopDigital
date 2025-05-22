const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto-js');

const sendMail = require('../ultils/sendMail');
const { generateAccessToken } = require('../middlewares/jwt');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields',
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    } else {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const emailCheck = btoa(email) + '@' + btoa(token);
        const newUser = User.create({
            email: emailCheck,
            name,
            password,
        });

        if (newUser) {
            const html = `<h2>Hello ${name}</h2><br/>
            <h3>We have received your request to create an account. Please enter this code on our Website:</h3>
            <p style="
            background-color: #eaf4ff;
            border: 1px solid #007bff;
            border-radius: 8px;
            padding: 16px 32px;
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            letter-spacing: 8px;
            display: inline-block;
            ">
            ${token}
            </p>`;
            await sendMail({ email, html, subject: 'confirm register new account' });
        }

        setTimeout(async () => {
            await User.deleteOne({ email: emailCheck });
        }, 15 * 60 * 1000);

        return res.json({
            success: newUser ? true : false,
            mes: newUser
                ? 'Please check your mail to active account'
                : 'Some thing went wrong, pleasse try again',
        });
    }
});

const finalregister = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const notActiveEmail = await User.findOne({ email: new RegExp(`${btoa(token)}$`) });
    if (notActiveEmail) {
        notActiveEmail.email = atob(notActiveEmail.email.split('@')[0]);
        notActiveEmail.save();
    }
    return res.json({
        success: notActiveEmail ? true : false,
        response: notActiveEmail
            ? 'Register is successfully. Go login'
            : 'Some things wents wrong. Try again! ',
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields',
        });
    }
    const user = await User.findOne({ email });

    if (user && (await user.isCorrectPassword(password))) {
        const { password, role, ...userData } = user.toObject();
        const accessToken = generateAccessToken(user._id, role);

        return res.status(200).json({
            accessToken,
            success: true,
            userData,
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }
});

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id)
        .select('-password ')
        .populate({
            path: 'cart',
            populate: {
                path: 'product',
                select: 'title thumb price color',
            },
        });
    return res.status(200).json({
        success: true,
        data: user,
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error('Please provide an email');
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('Email not found');
    const resetToken = user.createPasswordResetToken();
    await user.save();

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. 
  Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;

    const data = {
        email,
        html,
        subject: 'Forgot Password',
    };

    const rs = await sendMail(data);

    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        message: rs.response.includes('OK')
            ? 'please check your mail to reset password!'
            : 'send mail failed',
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error('Please provide a password and token');
    const passwordResetToken = crypto.SHA256(token).toString();
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Token is invalid or has expired');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangeAt = Date.now();
    await user.save();
    return res.status(200).json({
        success: true,
        message: 'Password reset successfully',
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' };

    const query = {};

    if (req?.query?.search) {
        delete formatedQueries.search;
        formatedQueries.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ];
    }

    let queryCommand = User.find(formatedQueries);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-_id'); // Mặc định sắp xếp theo ngày tạo
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    } else {
        queryCommand = queryCommand.select('-__v'); // Mặc định loại bỏ trường `__v`
    }

    const page = parseInt(req.query.page) || 1;
    const limit =
        req.query.limit !== undefined
            ? parseInt(req.query.limit)
            : parseInt(process.env.LIMIT_PRODUCT);

    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    const users = await queryCommand;
    const counts = await User.find(formatedQueries).countDocuments(formatedQueries);
    return res.status(200).json({
        success: true,
        counts,
        users,
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const users = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: users ? true : false,
        deleteUsers: users
            ? `User with email '${users.email}' deleted successfully`
            : 'User not found',
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Please provide an id');
    const { name, email, mobile } = req.body;
    const data = { name, email, mobile };
    if (req.file) data.avatar = req.file.path;
    const user = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role');
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'update success' : 'update fail',
    });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing input');
    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select(
        '-password -role'
    );
    return res.status(200).json({
        success: user ? true : false,
        deleteUsers: user ? user : 'No user update',
    });
});

const updateUserAdress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing input');
    const user = await User.findByIdAndUpdate(
        _id,
        { $push: { address: req.body.address } },
        { new: true }
    ).select('-password -role');
    return res.status(200).json({
        success: user ? true : false,
        deleteUsers: user ? user : 'No user update',
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity = 1, color } = req.body;
    if (!pid) throw new Error('Missing input');
    const cart = await User.findById(_id).select('cart');
    const alreadyProd = cart?.cart.find(p => p.product.toString() === pid);
    if (alreadyProd) {
        const respone = await User.updateOne(
            { cart: { $elemMatch: alreadyProd } },
            { $set: { 'cart.$.quantity': quantity } },
            { new: true }
        ).select('-password -role');
        return res.status(200).json({
            success: respone ? true : false,
            cart: respone ? respone : 'No user update',
        });
    } else {
        const respone = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { product: pid, quantity } } },
            { new: true }
        ).select('-password -role');
        return res.status(200).json({
            success: respone ? true : false,
            cart: respone ? respone : 'No user update',
        });
    }
});

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid } = req.params;
    const cart = await User.findById(_id).select('cart');
    const alreadyProd = cart?.cart.find(p => p.product.toString() === pid);
    if (!alreadyProd) {
        return res.status(200).json({
            success: true,
            cart: 'Updated your cart',
        });
    }
    const respone = await User.findByIdAndUpdate(
        _id,
        { $pull: { cart: { product: pid } } },
        { new: true }
    ).select('-password -role');
    return res.status(200).json({
        success: respone ? true : false,
        cart: respone ? respone : 'No user update',
    });
});

module.exports = {
    registerUser,
    loginUser,
    getCurrent,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAdress,
    updateCart,
    finalregister,
    removeProductInCart,
};
