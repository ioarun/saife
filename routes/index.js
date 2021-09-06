const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


router.get('/', ensureAuthenticated, (req, res) => {
    let fullname = req.user.firstname + " " + req.user.lastname
    res.render('dashboard', { title: "Dashboard", name: fullname })
});

module.exports = router