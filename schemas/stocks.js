const mongoose = require('mongoose')

const stocksSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'companie'
    },
    stocks:{
        type:Map,
        of:Number
    }
})

module.exports = new mongoose.model('stock',stocksSchema)