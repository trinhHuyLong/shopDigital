const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto-js');
const makeToken = require('uniqid');

const sendMail = require('../ultils/sendMail');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const { response } = require('express');

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
        const token = makeToken();
        const emailCheck = btoa(email) + '@' + token;
        const newUser = User.create({
            email: emailCheck,
            name,
            password,
        });

        if (newUser) {
            const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote>`;
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
    // const cookie = req.cookiess
    const { token } = req.params;
    const notActiveEmail = await User.findOne({ email: new RegExp(`${token}$`) });
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
    // if (!cookie || cookie?.dataregister?.token !== token) {
    //   res.clearCookie('dataregister')
    //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // }
    // const { email, name, password } = cookie.dataregister
    // const response = await User.create({ email, name, password });
    // res.clearCookie('dataregister')
    // if(response) return res.redirect(`${process.env.CLIENT_URL}/finalregister/successed`)
    // else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
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
        const { password, role, refreshToken, ...userData } = user.toObject();
        const accessToken = generateAccessToken(user._id, role);
        const newRefreshToken = generateRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, { newRefreshToken }, { new: true });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

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
    const user = await User.findById(_id).select('-password -refreshToken');
    return res.status(200).json({
        success: true,
        data: user,
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    const refreshedToken = cookies.refreshToken;
    if (!cookies && !refreshedToken) throw new Error('No refresh token');
    const user = await jwt.verify(refreshedToken, process.env.SECRET_KEY);
    const respone = await User.findOne({ _id: user._id, refreshToken: refreshedToken });

    return res.status(200).json({
        success: respone ? true : false,
        accessToken: respone
            ? generateAccessToken(respone._id, respone.role)
            : 'Refresh token not matching',
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.refreshToken) throw new Error('No cookies');
    await User.findOneAndUpdate(
        { refreshToken: cookies.refreshToken },
        { refreshToken: '' },
        { new: true }
    );

    res.clearCookie('refreshToken', { path: '/', httpOnly: true, maxAge: 0 });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
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
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true }).select(
        '-password -refreshToken -role'
    );
    return res.status(200).json({
        success: user ? true : false,
        deleteUsers: user ? user : 'No user update',
    });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing input');
    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select(
        '-password -refreshToken -role'
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
    ).select('-password -refreshToken -role');
    return res.status(200).json({
        success: user ? true : false,
        deleteUsers: user ? user : 'No user update',
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, color } = req.body;
    if (!pid || !quantity || !color) throw new Error('Missing input');
    const cart = await User.findById(_id).select('cart');
    const alreadyProd = cart?.cart.find(p => p.product.toString() === pid);
    if (alreadyProd) {
        if (alreadyProd.color === color) {
            const respone = await User.updateOne(
                { cart: { $elemMatch: alreadyProd } },
                { $set: { 'cart.$.quantity': quantity } },
                { new: true }
            ).select('-password -refreshToken -role');
            return res.status(200).json({
                success: respone ? true : false,
                cart: respone ? respone : 'No user update',
            });
        } else {
            const respone = await User.findByIdAndUpdate(
                _id,
                { $push: { cart: { product: pid, quantity, color } } },
                { new: true }
            ).select('-password -refreshToken -role');
            return res.status(200).json({
                success: respone ? true : false,
                cart: respone ? respone : 'No user update',
            });
        }
    } else {
        const respone = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { product: pid, quantity, color } } },
            { new: true }
        ).select('-password -refreshToken -role');
        return res.status(200).json({
            success: respone ? true : false,
            cart: respone ? respone : 'No user update',
        });
    }
});

module.exports = {
    registerUser,
    loginUser,
    getCurrent,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAdress,
    updateCart,
    finalregister,
};
