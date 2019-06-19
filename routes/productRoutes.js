const express = require('express')
const router = express.Router()
const product = require('../schemas/products.js')
const purchasedMaterials = require('../schemas/purchasedMaterials.js')
const mongoose = require('mongoose')

let wrongMaterials = ''
async function modifyArray(parts){
    let newArray = parts.map(async part=>{
        let partId
        await purchasedMaterials.findOne({productNumber:part.material})
            .exec()
            .then(result=>{
                partId = result._id
            })
            .catch(err=>{
                wrongMaterials += `${part.material},`
            })

        return {
            ...part,
            material:partId
        }
})
    const holder = await Promise.all(newArray)

    let filtered = holder.filter(part=>{return part.material !== undefined})

    let mappedParts = {}
    for(let part of filtered){
        mappedParts[part.material] = part.quantity
    }

    return mappedParts
}

async function modifyBOM(bom){
    let myBOM = []

    for(let key of bom.keys()){
        let current = await purchasedMaterials.findOne({_id:key}).exec()

        if(current){
            myBOM.push({
                partNumber:current.productNumber,
                description:current.description,
                quantity:bom.get(key)
            })
        }
    }

    return myBOM
}

function prepareQuery(request){
    let myObject = {}

    for(let key of Object.keys(request)){
        switch(key){
            // case 'description':
            // myObject['productDescription'] =  request[key];
            // break;

            case 'productNumber':
            myObject['productNumber'] = Number(request[key]);
            break;

            default:
            break;
        }
    }
    return myObject
}

router.post('/addProduct',async (req,res)=>{
    let missingMaterials = ''

    let existingProduct
    try{
      existingProduct = await product.findOne({productNumber:req.body.productNumber}).exec()
    }
    catch(err){
      console.log(err)
      res.status(409).json({message:"Product number should be a number"})
      return
    }

    if(existingProduct !== null){
      res.status(409).json({message:"Product with such number exists"})
      return
    }

    let requestedProduct = req.body

    let partsQuantities = req.body.partsQuantities

    //get the Id's of the requested product numbers from MongoDB
    let mappedParts = await modifyArray(partsQuantities)

    let parts = []
    for(let key of Object.keys(mappedParts)){
        parts.push(key)
    }

    if(wrongMaterials.length > 0){
      missingMaterials = wrongMaterials.split(',').filter(entry=>{return entry.length !== 0})
    }

    if(parts.length == 0){
      res.status(404).json({message:"At least one part has to be included in the BOM. Check if the parts you provided exist.",missingParts:missingMaterials})
      wrongMaterials = ''
      return
    }

    let newProduct = new product({
        _id:new mongoose.Types.ObjectId(),
        parts:parts,
        partsQuantities:mappedParts,
        productNumber:requestedProduct.productNumber,
        productDescription:requestedProduct.description
    })

    newProduct.save()
        .then(result=>{
            res.status(201).json({message:`Product: ${req.body.productNumber} - created`,missingParts:missingMaterials})
            wrongMaterials = ''
        })
        .catch(err=>{
          res.status(404).json({message:"Error occured"})
          wrongMaterials = ''
        })
})

router.post('/getBOM',async (req,res)=>{
    let query = prepareQuery(req.body)

    let currentProduct
    try{
      currentProduct = await product.findOne(query).exec()
    }catch(err){
      res.status(409).json({message:"Product number should be a number"})
      return
    }


    if(currentProduct == null){
      res.status(404).json({message:"No product with such number"})
      return
    }

    let modifiedBOM = await modifyBOM(currentProduct.partsQuantities)

    res.status(200).json({BOM:modifiedBOM})
})

router.post('/deleteProduct',async (req,res)=>{
  let currentProduct

  try{
    currentProduct = await product.findOne({productNumber:req.body.productNumber}).exec()
    console.log(currentProduct)
  }catch(err){
    res.status(409).json({message:"Product number should be a number"})
    return
  }

  if(currentProduct == null){
    res.status(404).json({message:"No product with such number"})
    return
  }

  currentProduct.remove()
          .then(response=>{
            res.status(200).json({message:`Product ${req.body.productNumber} deleted`})
            return
          })
          .catch(err=>{
            res.status(404).json({message:"An error occured. Please try again."})
          })
})

router.get('/getProducts',async (req,res)=>{
  let allProducts = await product.find().exec()

  if(allProducts.length == 0){
    res.status(404).json({message:"No products exist"})
    return
  }
  res.status(200).json({products:allProducts})
})
module.exports = router
