const express = require('express')
const router = express.Router()

// Wellcome Page
router.get('/',(req,res,next)=>{
    // res.send('Welcome')
    res.render("layout", {title: "MAIN"});
})


module.exports = router