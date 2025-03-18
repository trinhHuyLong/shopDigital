const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, role) => {
    return jwt.sign({_id: uid, role}, process.env.SECRET_KEY, {expiresIn: '3d'});
}

const generateRefreshToken = (uid) => {
    return jwt.sign({_id: uid}, process.env.SECRET_KEY, {expiresIn: '7d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}