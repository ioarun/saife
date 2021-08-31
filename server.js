require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))


app.get('/',(req,res,next)=>{
    res.sendFile(path.goin(__dirname,'public','index.html'))
})

app.listen(5000)