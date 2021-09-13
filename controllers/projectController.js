const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose')

const User = require('../models/User')
const Member = require('../models/Member')

// Register user handle
const registerUser = (req, res) => {

    // Object destructuring 
    const { firstName, lastName, email, phone, password, password2 } = req.body
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
        res.json({
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
                    res.json({
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
                                    let success = [];
                                    success.push({ msg: 'Registered' })
                                    // req.flash('success_msg', 'You are now registered and can log in')
                                    // res.redirect('/users/login')
                                    res.json({
                                        firstName,
                                        lastName,
                                        email,
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
}

// Register member handle 
const registerMember = (req, res) => {
    let currUserID = req.user._id;
     Member.find({userID:currUserID})
        .then(records => {
            let members = records


            // Object destructuring 
            const { firstName, lastName, gender, address, age, description } = req.body
            //console.log(req.body)
            let errors = [];

            // Check for required fields
            if (!firstName || !lastName || !gender || !address || !age) {
                errors.push({ msg: "Please fill in all the fields" })
            }

            // If there's an error re render the registraion page
            if (errors.length > 0) {
                res.json({
                    errors,
                    members,
                    firstName,
                    lastName,
                    gender,
                    address,
                    age,
                    title: "Member Register"
                })
            } else {
                // When the validation passed
                Member.findOne({ firstName:firstName, lastName:lastName, user: currUserID })
                    .then(member => {
                        if (member) {
                            // if there's a user rerender the register form
                            errors.push({ msg: 'name is already registered' })
                            res.json({
                                errors,
                                members,
                                firstName,
                                lastName,
                                gender,
                                address,
                                age,
                                description,
                                title: "Member Register"
                            });
                        } else {
                            const newMember = new Member({
                                firstName,
                                lastName,
                                gender,
                                address,
                                age,
                                description,
                                status: false,
                                videoURL: "",
                                userID: currUserID
                            });
                            newMember.save()
                                .then(member => {
                                    let success = [];
                                    success.push({ msg: 'Registered' })
                                    if (success.length > 0) {
                                        res.json({
                                            firstName,
                                            lastName,
                                            gender,
                                            address,
                                            age,
                                            description,
                                            success
                                        })
                                    }
                                })
                                .catch(err => console.log(err))


                        }
                    })

            }
        }).catch(err => console.log(err))
}

// Members page
const loadMembers = (req,res) => {
    let currUserID = req.user._id;
    Member.find({userID:currUserID})
        .then(records => {
            let members = records;
            res.render('members', { title: "Members", members });
        })
        .catch(err => console.log(err))
}

// Login handle
const userLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

// Logout handle
const userLogout = (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
}

// User account page
const userAccountSettings = (req, res) => {
    res.render('userAccountSettings', {
        title: "Account Settings",
        id: req.user._id.toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
    })
}

// Fall detected
const fallDetected = (req, res) => {
    // Object destructuring 
    const { userId, memberId} = req.body

    Member.find({_id: new mongoose.mongo.ObjectId(memberId)})
        .then(records => {
            let members = records;
            res.render('members', { title: "Members", members });
        })
        .catch(err => console.log(err))

        Member.findByIdAndUpdate(new mongoose.mongo.ObjectId(memberId), 
            {status: true}, function(err, data) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("fall status saved! ");
                    
                }
            });
}

module.exports = {
    registerUser,
    registerMember,
    loadMembers,
    userLogin,
    userLogout,
    userAccountSettings,
    fallDetected
};