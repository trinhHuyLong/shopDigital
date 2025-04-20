const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto-js');
const makeToken = require('uniqid')

const sendMail = require('../ultils/sendMail');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all the fields',
    });
  }
  const user = await User.findOne({ email })
  if (user) {
    throw new Error('User already exists')
  } else {
    const token = makeToken()
    res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
    const html = `Xin vui lòng click vào link dưới đây để hoàn thành quá trình tạo tài khoản. 
    Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
    await sendMail({ email, html, subject: 'Complete registration' })
    // const response = await User.create(req.body);

    return res.json({
      success: true,
      mes: 'Please check your mail to active account'
    })
  }
});

const finalregister = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  const { token } = req.params
  if (!cookie || cookie?.dataregister?.token !== token) {
    res.clearCookie('dataregister')
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
  }
  const { email, name, password } = cookie.dataregister
  const response = await User.create({ email, name, password });
  res.clearCookie('dataregister')
  if(response) return res.redirect(`${process.env.CLIENT_URL}/finalregister/successed`)
  else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
})

const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all the fields',
    });
  }
  const user = await User.findOne({ email })

  if (user && await user.isCorrectPassword(password)) {
    const { password, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, { newRefreshToken }, { new: true })

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      accessToken,
      success: true,
      userData
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const user = await User.findById(_id).select('-password -refreshToken -role');
  return res.status(200).json({
    success: true,
    data: user,
  })
});

const refreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const refreshedToken = cookies.refreshToken;
  if (!cookies && !refreshedToken) throw new Error('No refresh token');
  const user = await jwt.verify(refreshedToken, process.env.SECRET_KEY)
  const respone = await User.findOne({ _id: user._id, refreshToken: refreshedToken });

  return res.status(200).json({
    success: respone ? true : false,
    accessToken: respone ? generateAccessToken(respone._id, respone.role) : 'Refresh token not matching',
  })
})

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies || !cookies.refreshToken) throw new Error('No cookies');
  await User.findOneAndUpdate({ refreshToken: cookies.refreshToken }, { refreshToken: '' }, { new: true });

  res.clearCookie('refreshToken', { path: '/', httpOnly: true, maxAge: 0 });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error('Please provide an email');
  const user = await User.findOne({ email: email });
  if (!user) throw new Error('Email not found');
  const resetToken = user.createPasswordResetToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. 
  Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

  const data = {
    email,
    html,
    subject: 'Forgot Password'
  }

  const rs = await sendMail(data)

  return res.status(200).json({
    success: rs.response?.includes('OK')?true:false,
    message: rs.response.includes('OK')?'please check your mail to reset password!':'send mail failed'
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body
  if (!password || !token) throw new Error('Please provide a password and token')
  const passwordResetToken = crypto.SHA256(token).toString()
  const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
  if (!user) throw new Error('Token is invalid or has expired')
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangeAt = Date.now();
  await user.save();
  return res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  })
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken -role');
  return res.status(200).json({
    success: users ? true : false,
    users: users
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error('Please provide an id');
  const users = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: users ? true : false,
    deleteUsers: users ? `User with email '${users.email}' deleted successfully` : 'User not found'
  })
})

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0) throw new Error('Please provide an id');
  const user = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -refreshToken -role');
  return res.status(200).json({
    success: user ? true : false,
    deleteUsers: user ? user : 'No user update'
  })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error('Missing input');
  const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -refreshToken -role');
  return res.status(200).json({
    success: user ? true : false,
    deleteUsers: user ? user : 'No user update'
  })
})

const updateUserAdress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error('Missing input');
  const user = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -refreshToken -role');
  return res.status(200).json({
    success: user ? true : false,
    deleteUsers: user ? user : 'No user update'
  })
})

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error('Missing input');
  const cart = await User.findById(_id).select('cart');
  const alreadyProd = cart?.cart.find(p => p.product.toString() === pid);
  if (alreadyProd) {
    if (alreadyProd.color === color) {
      const respone = await User.updateOne({ cart: { $elemMatch: alreadyProd } }, { $set: { 'cart.$.quantity': quantity } }, { new: true }).select('-password -refreshToken -role');
      return res.status(200).json({
        success: respone ? true : false,
        cart: respone ? respone : 'No user update'
      })
    } else {
      const respone = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -refreshToken -role');
      return res.status(200).json({
        success: respone ? true : false,
        cart: respone ? respone : 'No user update'
      })
    }
  } else {
    const respone = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true }).select('-password -refreshToken -role');
    return res.status(200).json({
      success: respone ? true : false,
      cart: respone ? respone : 'No user update'
    })
  }
})

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
  finalregister
};