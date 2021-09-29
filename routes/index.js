const express = require('express');
// User Model
const User = require('../models/User');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
// router.get('/', (req, res) => {
//     res.render('welcome', { title: "Welcome" })
// });

// router.get('/', (req, res) => {
//     res.render('dashboard', { title: "Dashboard",name:req.body.firstname,id: user._id.toString() })
// });
// // Wellcome Page
// router.get('/',(req,res,next)=>{
//     // res.send('Welcome')
//     res.render("layout", {title: "MAIN"});
// })
router.get('/', ensureAuthenticated, (req, res) => {
    let fullname = req.user.firstName + " " + req.user.lastName
    // res.render('dashboard', { title: "Dashboard", name: fullname })
   
    User.findOne({ _id: req.user._id })
            .then(user => {
                // Check if push subscription object is undefined (push is not registered)
                if (!user.pushSubObj){
                    res.render('dashboard', {title: "Dashboard", name: fullname, id: user._id.toString()});
                } 
                else {
                    res.render('dashboard', {title: "Dashboard", name: fullname, id: null});
                }  
            });
});
module.exports = router