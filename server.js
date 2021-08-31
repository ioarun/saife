require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const routes = require('./routes/index')

const PORT = process.env.PORT || 5000

// app.use(express.static(__dirname + '/public'))


app.use('/',routes)

app.listen(PORT,console.log(`server started on port ${PORT}`))