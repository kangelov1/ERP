const express = require('express')
const router = express.Router()
const users = require('../schemas/users.js')
const company = require('../schemas/companies.js')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const key = require('../keys.js')

router.post('/signUp',async (req,res)=>{
    //check if such company exists
    let foundCompany = await company.findOne({name:req.body.company}).exec()
    if(foundCompany == null){
      res.status(404).json({message:"No such company"})
      return
    }

    //check if user with such email exists
    let userExists = await users.findOne({email:req.body.email}).exec()
    if(userExists !== null){
      res.status(400).json({message:"Email already used"})
      return
    }

    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            res.status(400).json({
                message:"Please try again"
            })
            return
        }
        else{
            let newUser = new users({
                _id:new mongoose.Types.ObjectId(),
                name:req.body.name,
                email:req.body.email,
                password:hash,
                company:req.body.company,
                position:req.body.position,
                registeredAt:new Date()
            })

            newUser.save()
                .then(result=>{
                    res.status(201).json(result)
                })
                .catch(error=>{
                  res.status(400).json({
                    message:error
                  })
                })
        }
    })
})

router.post('/login',(req,res)=>{
    //check if user with such email exists
    users.findOne({email:req.body.email}).exec()
        .then(doc=>{
            //check if the provided password matches the one in the database
            bcrypt.compare(req.body.password,doc.password,(err,result)=>{
                if(result){
                    //prepare token so that the orders and stocks are checked for the respective company for which the user works
                    const token = jwt.sign({name:doc.name,email:doc.email,company:doc.company},key,{expiresIn:"1h"})

                    res.status(200).json({
                        message:'You are signed in',
                        token:token
                    })
                }else{
                    res.status(401).json({
                        message:"Wrong username or password"
                    })
                }
            })
        })
        .catch(err=>{
            res.status(401).json({
                message:'Wrong username or password'
            })
        })
})
module.exports = router
