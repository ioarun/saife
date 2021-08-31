const express = require('express')
const router = express.Router()

// Wellcome Page
router.get('/',(req,res,next)=>{
    res.send('Welcome')
})


module.exports = router