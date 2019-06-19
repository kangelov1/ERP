const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const productStocks = require('../schemas/productStocks.js')
const products = require('../schemas/products.js')
const companies = require('../schemas/companies.js')

async function mapStocks(companyStocks){
    let myArray = []

    for(let key of companyStocks.keys()){
        let current = await products
                        .findOne({'_id':key})
                        .exec()
                        .catch(err=>{console.log(err)})

        if(current){
            let currentMaterial = {
              productNumber:current.productNumber,
              description:current.productDescription,
              quantity:companyStocks.get(key)
            }

            myArray.push(currentMaterial)
        }
    }

    return myArray
}

router.post('/updateStocks',async (req,res)=>{
    console.log(req.body)
    //get the company name from the token and find company id
    const decoded = jwt.decode(req.body.token)
    const companyId = await companies.findOne({name:decoded.company}).select('_id').exec()

    //get the current company record
    const currentCompany = await productStocks.findOne({companyId:companyId}).exec()
    console.log(currentCompany)

    //handle case if no record for this company exists
    if(!currentCompany){
        let initialStock = new productStocks({
            _id:new mongoose.Types.ObjectId(),
            companyId:companyId,
            stocks:req.body.stocks
        })

        await initialStock.save()
        return
    }
    else{
        currentCompany.stocks.set(Object.keys(req.body.stocks)[0],Object.values(req.body.stocks)[0])
        await currentCompany.save()
    }
    console.log(Object.keys(req.body.stocks)[0])
    console.log(Object.values(req.body.stocks)[0])
    //currentCompany.stocks.set(req.body)
})

router.post('/test',async (req,res)=>{
    const currentCompany = await productStocks.findOne({companyId:req.body.companyId}).exec()
    console.log(currentCompany)

    if(!currentCompany){
        console.log('need to initialize')

        console.log(req.body.stocks)
    }
})

router.post('/getStocks',async (req,res)=>{
    let company
    try{
      company = jwt.decode(req.body.token).company
    }catch(err){
      res.status(404).json({message:"Unauthorized"})
      return
    }

    let companyId = await companies.findOne({name:company}).select('_id').exec()
    let companyStocks
    try{
      companyStocks = await productStocks.findOne({'companyId':companyId}).select('stocks').exec()
    }catch(err){
      res.status(404).json({message:"No stocks exist"})
      return
    }
    
    if(companyStocks == null){
      res.status(404).json({message:"No stocks exist"})
      return
    }
    let mapped = await mapStocks(companyStocks.stocks)

    res.status(200).json({stocks:mapped})
})
module.exports = router
