require('dotenv').config()
const express = require('express')
const app = express()

app.get('/',(req,res,next)=>{
    res.send('<h1>Hello</h1>')
})

app.listen(5000)