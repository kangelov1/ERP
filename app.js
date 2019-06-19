const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')


//required routes
const userRoutes = require('./routes/userRoutes.js')
const materialRoutes = require('./routes/materialRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const companyRoutes = require('./routes/companyRoutes.js')
const orderRoutes = require('./routes/orderRoutes.js')
const stockRoutes = require('./routes/stockRoutes.js')
const productStockRoutes = require('./routes/productStockRoutes.js')

const app = express()

//handle CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','*')

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','*')
        return res.status(200).json({})
    }
    next()
})
//set up middleware to parse the request
app.use(bodyParser.json())

//set up route handlers
app.use('/user',userRoutes)
app.use('/purchasedMaterials',materialRoutes)
app.use('/products',productRoutes)
app.use('/company',companyRoutes)
app.use('/orders',orderRoutes)
app.use('/stocks',stockRoutes)
app.use('/productStocks',productStockRoutes)

//required for Heroku build
if(process.env.NODE_ENV ==='production'){
    app.use(express.static('client/build'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })

}
//try to connect to MongoDB atlas, put your connection string
mongoose.connect('***',{useNewUrlParser:true})

//check if succesfully connected
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB')
});

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})
