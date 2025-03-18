const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        const accessToken = req.headers.authorization.split(' ')[1];
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
            if(err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token',
                });
            } else {
                req.user = user;
                next();
            }
        })
    }else {
        return res.status(401).json({
            success: false,
            message: 'Access token not found',
        });
    }
})


module.exports = {
    verifyAccessToken
}