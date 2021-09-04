const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User Model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: "Login" })
})
// Register Page 
router.get('/register', (req, res) => {
    res.render('register', { title: "Register" })
})
// Register handle
router.post('/register', (req, res) => {
    // Object destructuring 
    const { firstname, lastname, email, phone, password, password2 } = req.body
    console.log(req.body)
    let errors = [];

    // Check for required fields
    if (!firstname || !lastname || !email || !phone || !password || !password2) {
        errors.push({ msg: "Please fill in all the fields" })
    }

    // Phone number lenth
    if(isNaN(phone) || phone.length !=10){
        errors.push({msg:'Phone number is incorrect '})
    }

    //  Check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    // If there's an error re render the registraion page
    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstname,
            lastname,
            email,
            phone,
            password,
            password2,
            title: "Register"
        })
    } else {
        // When the validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // if there's a user rerender the register form
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register', {
                        errors,
                        firstname,
                        lastname,
                        email,
                        phone,
                        password,
                        password2,
                        title: "Register"
                    })
                } else {
                    const newUser = new User({
                        firstname,
                        lastname,
                        email,
                        phone,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err
                            }
                            // Set password to hashed
                            newUser.password = hash
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })

    }

})

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router;