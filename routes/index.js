const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (req, res) => {
    res.render('welcome', {title: "Welcome"})
});
// // Wellcome Page
// router.get('/',(req,res,next)=>{
//     // res.send('Welcome')
//     res.render("layout", {title: "MAIN"});
// })

module.exports = router