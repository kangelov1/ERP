const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'purchasedMaterial'
        }
    ],
    partsQuantities:{
        type:Map,
        of:Number
    },
    productNumber:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    }
})

module.exports = new mongoose.model('product',productSchema)