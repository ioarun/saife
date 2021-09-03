const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => {
    res.render('welcome', { title: "Welcome" })
});
// // Wellcome Page
// router.get('/',(req,res,next)=>{
//     // res.send('Welcome')
//     res.render("layout", {title: "MAIN"});
// })
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    let fullname = req.user.firstname + " " + req.user.lastname
    res.render('dashboard', { title: "Dashboard", name: fullname })
});
module.exports = router