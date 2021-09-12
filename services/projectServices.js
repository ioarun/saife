const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Member = require('../models/Member')

// Create user account if user is not already registered
const registerUserService = (req, res, errors) => {
    const { firstName, lastName, email, phone, password, password2 } = req.body
    // When the validation passed
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                // if there's a user rerender the register form
                errors.push({ msg: 'Email is already registered' })
                res.status(400)
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
                                res.status(200).redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
            }
        })
}

// Register new member service
const registerMemberService = (req, res) => {
    Member.find({})
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
                Member.findOne({ firstName: firstName })
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
                            })
                        } else {
                            const newMember = new Member({
                                firstName,
                                lastName,
                                gender,
                                address,
                                age,
                                description
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

// Service for Members page
const loadMembersService = (req, res) => {
    Member.find({})
        .then(records => {
            let members = records
            res.render('members', { title: "Members", members });
        })
        .catch(err => console.log(err))
}

// Passport service for log in
const userLoginService = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        console.log(info)
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/users/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });

    })(req, res, next);
}

// User logout service
const userLogoutService = (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
}

// User Acccount service
const userAccountSettingsService = (req, res) => {
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
    registerUserService,
    registerMemberService,
    loadMembersService,
    userLoginService,
    userLogoutService,
    userAccountSettingsService
}