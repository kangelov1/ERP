const mongoose = require('mongoose')

const purchMatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    productNumber:{
        type:Number,
        required:true
    }
})

module.exports = new mongoose.model('purchasedMaterial',purchMatSchema)