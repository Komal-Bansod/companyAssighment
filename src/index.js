const express = require('express')
const bodyParser= require('body-parser')
const mongoose = require('mongoose')
const route= require('./route/router.js')
const app = express()



///for cookies

const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(bodyParser.json())
mongoose.connect("mongodb+srv://komalbansod_04:BdcyrSiZZa4v5y76@komal04.fvnel.mongodb.net/outShade?retryWrites=true&w=majority", {    
    
useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function(){
    console.log(`the express is run on ` + (process.env.PORT || 3000))
})