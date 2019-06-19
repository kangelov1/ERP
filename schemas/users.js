const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        minlength:6
    },
    company:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true,
        enum:['employee','manager']
    },
    registeredAt:{
        type:Date
    }
})

module.exports = new mongoose.model('User',userSchema)