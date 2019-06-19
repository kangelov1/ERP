const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const stocks = require('../schemas/stocks.js')
const purchasedMaterials = require('../schemas/purchasedMaterials.js')
const companies = require('../schemas/companies.js')

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
                console.log(err)
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

async function mapStocks(companyStocks){
    let myArray = []

    for(let key of companyStocks.keys()){
        let current = await purchasedMaterials
                        .findOne({'_id':key})
                        .exec()
                        .catch(err=>{console.log(err)})

        if(current){
            let currentMaterial = {
              productNumber:current.productNumber,
              description:current.description,
              price:current.price,
              quantity:companyStocks.get(key)
            }

            myArray.push(currentMaterial)
        }
    }

    return myArray
}

router.post('/updateStocks',async (req,res)=>{
    //prepare variable for missing materials
    let missingMaterials = ''

    //get the company name from the token and find company id
    const decoded = jwt.decode(req.body.token)
    const companyId = await companies.findOne({name:decoded.company}).select('_id').exec()

    //get the current company record
    const currentCompany = await stocks.findOne({companyId:companyId}).exec()

    //handle case if no record for this company exists
    if(!currentCompany){
        //modify the request array
        let mappedParts = await modifyArray(req.body.stocks)

        //turn the modified array in an object

        let finalStock = {
            ...mappedParts
        }

        let newStocks = new stocks({
            _id:new mongoose.Types.ObjectId(),
            companyId:companyId,
            stocks:finalStock
        })

        if(wrongMaterials.length > 0){
          missingMaterials = wrongMaterials.split(',').filter(entry=>{return entry.length !== 0})
          console.log(missingMaterials)
        }

        newStocks.save()
            .then(result=>{
                //console.log(result)
                res.status(200).json({message:'stock initialized',stock:newStocks,missingParts:missingMaterials})
                wrongMaterials = ""
                return
            })
            .catch(err=>{
              console.log(err)
              wrongMaterials = ""
              return
            })
        return
    }

    let currentStock = [...currentCompany.stocks]

    let stockObject = {}
    for(let part of currentStock){
        stockObject[part[0]] = part[1]
    }

    //modify the request array
    //turn the modified array in an object
    let mappedParts = await modifyArray(req.body.stocks)

    //update the stocks of the company
    let finalStock = {
        ...stockObject,
        ...mappedParts
    }

    if(wrongMaterials.length > 0){
      missingMaterials = wrongMaterials.split(',').filter(entry=>{return entry.length !== 0})
      console.log(missingMaterials)
    }

    if(Object.keys(mappedParts).length == 0){
      res.status(409).json({message:"None of the parts provided exists"})
      wrongMaterials = ""
      return
    }
    //save the updated company record
    currentCompany.stocks = finalStock
    currentCompany
        .save()
        .then(record=>{
          res.status(200).json({message:"Records updated",missingParts:missingMaterials})
          wrongMaterials = ""
        })
        .catch(err=>{
          res.status(404).json({message:"Error occured"})})
          wrongMaterials = ""
})

router.post('/getPartsStocks',async (req,res)=>{
    let company = jwt.decode(req.body.token).company
    let companyId = await companies.findOne({name:company}).select('_id').exec()

    let companyStocks
    try{
      companyStocks = await stocks.findOne({'companyId':companyId}).select('stocks').exec()
    }catch(err){
      res.status(404).json({message:"No stocks exist"})
      return
    }

    if(companyStocks == null){
      res.status(404).json({message:"No stocks exist"})
      return
    }
    let mappedStocks = await mapStocks(companyStocks.stocks)

    res.status(200).json({stocks:mappedStocks})
})
module.exports = router
