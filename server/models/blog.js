const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numberViews:{
        type:Number,
        defaule:0,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User' ,
        }
    ],
    disLikes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' ,
        }
    ],
    image: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTawnAbB8TxT5VyGrlCaEybzo-KZhcdbsEyvg&s'
    },
    author: {
        type: String,
        default: 'Admin'
    }
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);