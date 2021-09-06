const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
let members = [
    {
        name: "Gouri Nandan",
        age: "38"
    },
    {
        name: "Arun",
        age: "36"
    },
    {
        name: "Sodi",
        age: "35"
    },
    {
        name: "Chasham",
        age: "33"
    }
];

// Welcome Page
// router.get('/', (req, res) => {
//     res.render('welcome', { title: "Welcome" })
// });
// // Wellcome Page
// router.get('/',(req,res,next)=>{
//     // res.send('Welcome')
//     res.render("layout", {title: "MAIN"});
// })
router.get('/', ensureAuthenticated, (req, res) => {
    let fullname = req.user.firstname + " " + req.user.lastname
    res.render('members', { title: "Dashboard", name: fullname ,members})
});
module.exports = router