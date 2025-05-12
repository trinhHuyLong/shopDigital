const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
        },
        mobile: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'superAdmin'],
            default: 'user',
        },
        cart: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                quantity: Number,
                color: String,
            },
        ],
        address: {
            type: Array,
            default: [],
        },
        wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        passwordChangeAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
        registerToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});
userSchema.methods = {
    isCorrectPassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    },
    createPasswordResetToken: function () {
        const resetToken = crypto.lib.WordArray.random(32).toString(); // Tạo token ngẫu nhiên
        this.passwordResetToken = crypto.SHA256(resetToken).toString(); // Lưu mã băm của token vào DB

        this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token hết hạn sau 10 phút

        return resetToken;
    },
};
//Export the model
module.exports = mongoose.model('User', userSchema);
