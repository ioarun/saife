const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User')
const Member = require('../models/Member')

// Register user handle
const registerUser = (req, res) => {

    // Object destructuring 
    const { firstName, lastName, email, phone, password, password2 } = req.body
    console.log(req.body)
    let errors = [];

    // Check for required fields
    if (!firstName || !lastName || !email || !phone || !password || !password2) {
        errors.push({ msg: "Please fill in all the fields" })
    }

    // Phone number lenth
    if (isNaN(phone) || phone.length != 10) {
        errors.push({ msg: 'Phone number is incorrect ' })
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
            firstName,
            lastName,
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
                        firstName,
                        lastName,
                        email,
                        phone,
                        password,
                        password2,
                        title: "Register"
                    })
                } else {

                    const newUser = new User({
                        firstName,
                        lastName,
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
}

// Register member handle 
const registerMember = (req, res) => {
    Member.find({})
        .then(records => {
            let members = records

            // Object destructuring 
            //const { firstName, lastName,gender, email, address, age, description, phone } = req.body
            let errors = [];

            // Check for required fields
            if (!firstName || !lastName || !gender || !email || !address || !age || !phone) {
                errors.push({ msg: "Please fill in all the fields" })
            }

            // Phone number lenth
            if (isNaN(phone) || phone.length != 10) {
                errors.push({ msg: 'Phone number is incorrect ' })
            }

            // If there's an error re render the registraion page
            if (errors.length > 0) {
                res.render('members', {
                    errors,
                    members,
                    firstName,
                    lastName,
                    gender,
                    email,
                    address,
                    age,
                    phone,
                    title: "Member Register"
                })
            } else {
                // When the validation passed
                Member.findOne({ email: email })
                    .then(member => {
                        if (member) {
                            // if there's a user rerender the register form
                            errors.push({ msg: 'Email is already registered' })
                            res.render('members', {
                                errors,
                                members,
                                firstName,
                                lastName,
                                gender,
                                email,
                                address,
                                age,
                                description,
                                phone,
                                title: "Member Register"
                            })
                        } else {
                            const newMember = new Member({
                                firstName,
                                lastName,
                                gender,
                                email,
                                address,
                                age,
                                description,
                                phone
                            });
                            newMember.save()
                                .then(member => {
                                    req.flash('success_msg', 'New user saved successfully')
                                    res.render('members', { title: "Dashboard", members })
                                })
                                .catch(err => console.log(err))


                        }
                    })

            }
        }).catch(err => console.log(err))
}

// Members page
const loadMembers = (req,res) => {
    Member.find({})
        .then(records => {
            let members = records
            res.render('members', { title: "Members", members });
        })
        .catch(err => console.log(err))
}

// Login handle
const userLogin = (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

// Logout handle
const userLogout = (req,res)=>{
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
}

// User account page
const userAccountSettings =(req,res)=>{
    res.render('userAccountSettings', {
        title: "Account Settings",
        id: req.user._id.toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
    })
} 
module.exports = {
    registerUser,
    registerMember,
    loadMembers,
    userLogin,
    userLogout,
    userAccountSettings
};