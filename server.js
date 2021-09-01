require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const expressLayouts =require('express-ejs-layouts')

// EJS 
app.use(expressLayouts)
app.set('view engine','ejs')

const indexRoutes = require('./routes/index')
const expertRoutes = require('./routes/experts')

const PORT = process.env.PORT || 5000

// app.use(express.static(__dirname + '/public'))

// Routes
app.use('/',indexRoutes)
app.use('/experts',expertRoutes)



app.listen(PORT,console.log(`server started on port ${PORT}`))