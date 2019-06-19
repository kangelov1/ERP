const mongoose = require('mongoose')
const order = require('../schemas/orders.js')
const product = require('../schemas/products.js')
const purchasedMaterials = require('../schemas/purchasedMaterials.js')
const stocks = require('../schemas/stocks.js')
const productStocks = require('../schemas/productStocks.js')
const company = require('../schemas/companies.js')
const PROFIT = 0.2

module.exports.getOrder  = async function(orderId){
    //check if orderId is valid
    let isValid = mongoose.Types.ObjectId.isValid(orderId)
    if(!isValid){
      throw "Not a valid order"
    }

    //check if order exists
    let myOrder = await order.findOne({_id:orderId}).exec()
    if(myOrder == null){
      throw "No order with such id"
    }

    if(myOrder.status !== 'created'){
      throw "Can't change an already executed order"
    }

    return myOrder

}
module.exports.checkParts = async function(productId){
    let myProduct = await product.findOne({_id:productId}).select('partsQuantities').exec()
    if(myProduct == null){
      throw "No such product"
    }
    return myProduct
    //     .then(result=>{
    //       myProduct = result
    //     })
    //     .catch(err=>{
    //       throw new Error(err.message)
    //     })
    //
    // return myProduct
}
module.exports.checkQuantities = async function(companyId,orderQuantity,partsList){
    let areAvailable = true

    let currentStocks = await stocks.findOne({companyId:companyId}).select('stocks')
            .exec()

    partsList.forEach(async (value,key)=>{
        let requiredQuantity = value * orderQuantity

        if(requiredQuantity > currentStocks.stocks.get(key)){
            areAvailable = false
        }
    })
    return areAvailable
}
module.exports.changeOrderStatus = async function(partsStatus,requestedOrder){
    if(partsStatus){
        requestedOrder.status = 'completed'
        await requestedOrder.save()
        return 'completed'
    }else{
        requestedOrder.status = 'rejected'
        await requestedOrder.save()
        return 'rejected'
    }
}
module.exports.changePartsQuantities = async function(companyId,orderQuantity,partsList){

    let currentStocks = await stocks.findOne({companyId:companyId}).select('stocks').exec()

    partsList.forEach(async (value,key)=>{

        let requiredQuantity = value * orderQuantity

        let currentStock = currentStocks.stocks.get(key)
        let newStock = currentStock - requiredQuantity

        currentStocks.stocks.set(key,newStock)
    })

    await currentStocks.save()
}
module.exports.changeProductQuantities = async function(companyId,orderQuantity,productId){

    let currentStocks = await productStocks.findOne({companyId:companyId}).exec()

    //check if company stocks for products exist
    if(!currentStocks){
        let initialStock = new productStocks({
            _id:new mongoose.Types.ObjectId(),
            companyId:companyId,
            stocks:{}
        })

        await initialStock.save()
            .then(async response=>{
                response._doc.stocks.set(productId.toString(),orderQuantity)
                await response.save()

                return
            })
            .catch(err=>{console.log(err)})

        return
    }

    let curreProductStock = currentStocks.stocks.get(productId.toString())

    //check if product exists in product stocks
    if(!curreProductStock){
        currentStocks.stocks.set(productId.toString(),orderQuantity)
        await currentStocks.save()
        return
    }

    else{
        let updatedQuantity = curreProductStock + orderQuantity
        currentStocks.stocks.set(productId.toString(),updatedQuantity)
        await currentStocks.save()
        return
    }
}
module.exports.changeCompanyBalance = async function(companyId,orderQuantity,partsList){
  let totalSum = 0

  let promises = []

  partsList.forEach((value,key)=>{
    promises.push(purchasedMaterials.findOne({_id:key}).exec())
  })

  await Promise.all(promises)
        .then((res)=>{
          for(let entry of res){
            totalSum += entry.price * orderQuantity * partsList.get((entry._id).toString())
          }
        })
        .catch(err=>{console.log(err)})

  let withProfit = totalSum * 0.2
  let currentCompany = await company.findOne({_id:companyId}).exec()
  currentCompany.balance += withProfit
  await currentCompany.save()
}
