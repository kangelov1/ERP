const express = require('express')
const router = express.Router()
const purchMat = require('../schemas/purchasedMaterials.js')
const mongoose = require('mongoose')

router.post('/addMaterial',async (req,res)=>{
    let materialExists
    try{
      materialExists = await purchMat.findOne({productNumber:req.body.productNumber})
    }
    catch(err){
      res.status(409).json({message:"Product number should be a number"})
      return
    }

    if(materialExists !== null){
      res.status(409).json({message:"Material exists"})
      return
    }

      let newMaterial = new purchMat({
          _id:new mongoose.Types.ObjectId(),
          description:req.body.description,
          price:req.body.price,
          productNumber:req.body.productNumber
      })

    newMaterial.save()
        .then(result=>{
          res.status(201).json({message:`Part Number: ${newMaterial.productNumber}`})
        })
        .catch(err=>{
          console.log(err)
          res.status(409).json({message:"Price should be a number"})
        })
})
router.get('/getMaterials',async (req,res)=>{
  let allMaterials = await purchMat.find().exec()
  if(allMaterials.length == 0){
    res.status(404).json({message:"No materials exist"})
    return
  }
  res.status(200).json({parts:allMaterials})
})
module.exports = router
