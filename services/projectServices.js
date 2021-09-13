const passport = require('passport')
const bcrypt = require('bcryptjs')
const _ =require('lodash')
const User = require('../models/User')

const Member = require('../models/Member')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

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

// Forgot Password handle
const userFogotPasswordService = (req, res) => {
    const { email } = req.body
    console.log(email)

    let errors = [];
    if (!email) {
        errors.push({ msg: 'Please fill in the field' })
    }
    if (errors.length > 0) {
        res.json({
            errors,
            email
        })
    } else {
        User.findOne({ email: email })
            .then(member => {
                if (member) {
                    let success = []
                    success.push({ msg: 'Please check your email in box for a link to complete the reset' })
                    const token = jwt.sign({ _id: member._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m' })
                    // Export the token
                    exports.token=token;
                    const output = `<p> Hello ${member.firstName} ${member.lastName} please click the link bellow to reset password</p>
                    <a href="http://localhost:5000/users/passwordReset/${token}">Click Here</a>`


                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: "smtpout.secureserver.net",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'official@saife.app', // generated ethereal user
                            pass: 'official123', // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    // send mail with defined transport object
                    let mailOptions = {
                        from: '"SAIFE App" <official@saife.app>', // sender address
                        to: "izuru775@gmail.com", // list of receivers
                        subject: "SAIFE App password reset", // Subject line
                        text: "Hello world?", // plain text body
                        html: output, // html body
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    });

                    // after sending email update resetLink in db
                    member.updateOne({ resetLink: token }, (err, success) => {
                        if (err) {
                            errors.push({ msg: "Reset password link error" })
                            res.status(400).json({ errors })
                        } else {
                            let success = []
                            success.push({ msg: 'Please check your email in box for a link to complete the reset' })
                            res.json({
                                success,
                                email
                            })
                        }
                    })

                } else {
                    errors.push({ msg: 'This email is not registered' })
                    res.status(400).json({
                        errors,
                        email
                    })
                }
            })
    }

}

// Email password handle
const userEmailPasswordService = (req,res,routeToken) =>{
    const resetlink = routeToken;
    console.log(resetlink)
    res.render('passwordReset',{title:"Reset Password",resetlink})

}

// Password reset services 
const userResetPasswordService = (req, res) => {
    const { resetLink, newPassword } = req.body
    // Verify if the resetLink is the same 
    console.log(req.body)
    if (resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired"
                })
            }
            User.findOne({ resetLink }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: "User with this token does not exist" })
                }
                const obj = {
                    password: newPassword,
                    resetLink:''
                }
                // use loash extend property to update password within the user
                user = _.extend(user,obj)

                user.save((err,result)=>{
                    if(err){
                        return res.status(400).json({error:"Reset password error"})
                    }
                    else{
                        return res.status(200).json({msg:"Your password has been changed"})
                    }
                })

            })
        })
    } else {
        return res.status(200).json({error:"Authentication errror!!!"})
    }
}


module.exports = {
    registerUserService,
    registerMemberService,
    loadMembersService,
    userLoginService,
    userLogoutService,
    userAccountSettingsService,
    userFogotPasswordService,
    userEmailPasswordService,
    userResetPasswordService,
    
}