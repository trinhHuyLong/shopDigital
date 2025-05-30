const mongoose = require('mongoose')
const dotenv = require('dotenv')

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected successfully')
    }catch(err){
        console.log(err)
    }
}

module.exports = dbConnection