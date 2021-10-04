const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth');

const Expert = require('../models/Expert')
// Expert Login Page
router.get('experts/Login',ensureAuthenticated, (req, res, next) => {
    let fullname = req.user.firstName + " " + req.user.lastName

    Expert.findOne({ _id: req.user._id })
            .then(user => {
                // Check if push subscription object is undefined (push is not registered)
                if (user){
                    res.render('expertRegister', {
                        title: "Expert Dashboard",
                        firstName: user.firstName,
                        lastName:user.lastName,
                        registration:user.registration,
                        phone:user.phone
                    });
                }  
            });
})
// Expert Register Page 
router.post('experts/Register', (req, res, next) => {
    const { firstName, lastName, registration, email, phone, password, password2 } = req.body;
    const errors = [];

    // Check if the fields are empty
    if (!firstName || !lastName || !registration || !email || !password) {
        errors.push({ msg: "Please fill all the fields" })
    }
    if (registration.length < 6) {
        errors.push({ msg: "Registration number is too short" })
    }
    if (password.length < 6) {
        errors.push({ msg: "password is too short" })
    }
    if (password !== password2) {
        errors.push({ msg: "passwords do not match" })
    }
    if (errors.length > 0) {
        res.json({
            errors,
            firstName,
            lastName,
            registration,
            email,
            phone,
            password,
            password2,
            title: "Expert register"
        })
    } else {
        Expert.findOne({ email: email })
            .then(expert => {
                if (expert) {
                    errors.push({ msg: "Email is already registered" })
                    res.status(400)
                    res.render('expertRegisterModal', {
                        errors,
                        firstName,
                        lastName,
                        registration,
                        email,
                        phone,
                        password,
                        password2,
                        title: "Expert Register"
                    })
                } else{
                    const newExpert = new Expert({
                        firstName,
                        lastName,
                        registration,
                        email,
                        phone,
                        password
                    })

                     // Hash Password
                bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newExpert.password, salt, (err, hash) => {
                    if (err) {
                        throw err
                    }
                    // Set password to hashed
                    newExpert.password = hash
                    // Save user
                    newExpert.save()
                        .then(user => {
                            let success = [];
                            success.push({ msg: 'Registered' })
                            // req.flash('success_msg', 'You are now registered and can log in')
                            // res.redirect('/users/login')
                            res.json({
                                firstName,
                                lastName,
                                email,
                                registration,
                                phone,
                                password,
                                password2,
                                success
                            })
                        })
                        .catch(err => console.log(err))
                }))
                }
            })
    }


})

module.exports = router