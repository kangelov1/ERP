const express = require('express')
const router = express.Router()
const company = require('../schemas/companies.js')
const mongoose = require('mongoose')

router.post('/createCompany',(req,res)=>{
    let newCompany = new company({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        balance:req.body.balance
    })

    newCompany.save().then(result=>{console.log(result)}).catch(err=>{console.log(err)})
})

router.get('/listAll',(req,res)=>{
    console.log(req)
    company.find().exec()
        .then(result=>{
        console.log(result)
        res.status(200).json(result)
    }).catch(err=>{
        res.status(404).json(err.message)
    })
})

module.exports = router
