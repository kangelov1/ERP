const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    soldProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        }
    ],
    employees:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})

module.exports = new mongoose.model('companie',companySchema)