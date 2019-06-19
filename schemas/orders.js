const mongoose = require('mongoose')
const ordersSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    quantity:{
        type:Number,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'companie'
    },
    status:{
        type:String,
        enum:['created','completed','rejected'],
        default:'created'
    }
})

module.exports = new mongoose.model('order',ordersSchema)