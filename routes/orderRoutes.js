const express = require('express')
const router = express.Router()
const order = require('../schemas/orders.js')
const companies = require('../schemas/companies.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const products = require('../schemas/products')

const getOrder = require('../helperFunctions/executeOrder.js').getOrder
const checkParts = require('../helperFunctions/executeOrder.js').checkParts
const checkQuantities = require('../helperFunctions/executeOrder.js').checkQuantities
const changeOrderStatus = require('../helperFunctions/executeOrder.js').changeOrderStatus
const changePartQuantities = require('../helperFunctions/executeOrder.js').changePartsQuantities
const changeProductQuantities = require('../helperFunctions/executeOrder.js').changeProductQuantities
const changeCompanyBalance = require('../helperFunctions/executeOrder.js').changeCompanyBalance

async function modifyOrders (orders){
    let modifiedOrders = orders.map(async order=>{
        let productNumber
        await products.findOne({_id:order.product})
            .exec()
            .then(result=>{
                productNumber = result.productNumber
            })
            .catch(err=>console.log(err))
        return {
            ...order._doc,
            product:productNumber
        }
    })
    const holder = await Promise.all(modifiedOrders)
    return holder
}

router.get('/executeOrder/:orderId',async (req,res)=>{
    //get Order Id from url

    //save order in a variable
    let currentOrder
    try{
      currentOrder =  await getOrder(req.params.orderId)
      //console.log(currentOrder)
      let requestedProduct = await checkParts(currentOrder.product)
      //console.log(requestedProduct)
      let areAvailable = await checkQuantities(currentOrder.company,currentOrder.quantity,requestedProduct.partsQuantities)
      //console.log(areAvailable)
      if(areAvailable){
         changePartQuantities(currentOrder.company,currentOrder.quantity,requestedProduct.partsQuantities)
         changeProductQuantities(currentOrder.company,currentOrder.quantity,requestedProduct._id)
         changeCompanyBalance(currentOrder.company,currentOrder.quantity,requestedProduct.partsQuantities)
      }
      //change the status of the order based on part availability
      let orderStatus = await changeOrderStatus(areAvailable,currentOrder)
      if(orderStatus == 'completed'){
        res.status(200).json({message:`Order ${orderStatus}`})
        return
      }
      res.status(200).json({message:`Order ${orderStatus} - not enough parts in stock`})
    }
    catch(err){
      res.status(400).json({message:err})
      return
    }
})

router.post('/createOrder',async (req,res)=>{
    //decode token in request to find the company for the employee
    const decoded = jwt.decode(req.body.token)

    //get the company id
    const company = await companies.findOne({name:decoded.company})

    //find the product id for the requested product
    let productId
    let product
    try{
      product = await products.findOne({productNumber:req.body.product})
         .exec()
    }catch(err){
      res.status(409).json({message:"Product number should be a number"})
      return
    }

    if(product == null){
      res.status(404).json({message:"No such product exists"})
      return
    }
    productId = product._id

    //create new order
    let newOrder = new order({
        company:company._id,
        product:productId,
        quantity:req.body.quantity
    })

    newOrder.save()
        .then(result=>{
            res.status(200).json({
                message:'Order created',
                order:result
            })
        })
        .catch(err=>{
            res.status(400).json({
                message:err.message
            })
        })
})

router.post('/getOrders',async (req,res)=>{
   //Get the company id from request token
   const decoded = jwt.decode(req.body.token)
   const company = await companies.findOne({name:decoded.company})

   //get the orders for the given company and order status
   const myOrders = await order.find({status:req.body.orderStatus,company:company._id}).exec()

   //modify the orders so that the product number is sent instead of the product id in MongoDb
   let modified = await modifyOrders(myOrders)

   //send modified orders to client
   res.status(200).json(modified)
})

module.exports = router
