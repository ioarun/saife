const express = require('express')
const router = express.Router()


// Login Page
router.get('/Login',(req,res,next)=>{
    res.send('Login')
})
// Register Page 
router.get('/Register',(req,res,next)=>{
    res.send('Register')
})

module.exports = router