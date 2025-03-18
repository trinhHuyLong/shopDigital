const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password
  } = req.body;
  if(!firstname || !lastname || !email || !password) {
    return res.status(400).json({
        success: false,
        message: 'Please fill all the fields',
    });
  }
  const user = await User.findOne({email})
  if(user) {
    throw new Error('User already exists')
  } else {
    const response = await User.create(req.body);
    return res.status(201).json({
        success: response ? true : false,
        data: response,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  if(!email || !password) {
    return res.status(400).json({
        success: false,
        message: 'Please fill all the fields',
    });
  }
  const user = await User.findOne({email})
  
  if(user && await user.isCorrectPassword(password)) {
    const { password, role, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const refreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(user._id, {refreshToken}, {new: true})

    res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000});

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
  const {_id} = req.user
  const user = await User.findById(_id).select('-password -refreshToken -role');
  return res.status(200).json({
    success: true,
    data: user,
  })
});

module.exports = {
    registerUser,
    loginUser,
    getCurrent,
};