const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                count: Number,
            },
        ],
        status: {
            type: String,
            default: 'Processing',
            enum: ['Cancelled', 'Processing', 'Successed'],
        },
        total: Number,
        orderBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);
