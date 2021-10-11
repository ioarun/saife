require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const User = require('../models/User')
const PORT = process.env.PORT || 3000
const ROOT_URL = process.env.ROOT_URL || "http://localhost:3000"
const Member = require('../models/Member')
const Expert = require('../models/Expert');
const userExpert = require('../models/userExpert');
const ExpertMember = require('../models/ExpertMember');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const webpush = require('web-push');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const request = require('request');


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

// Register new member service
const registerMemberService = (req, res) => {
    let currUserID = req.user._id;
    Member.find({ userID: currUserID })
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
                Member.findOne({ firstName: firstName, lastName: lastName, user: currUserID })
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

// Service for Expert Members page
const loadExpertMembersService = async (req, res) => {
    let expertId = req.user._id;

    await ExpertMember.find({ expertId: expertId })
        .then(async (records) => {
            let members = [];
            for (let i = 0; i < records.length; i++) {
                await Member.find({ _id: records[i].memberId })
                    .then(record => {
                        let member = JSON.parse(JSON.stringify(record[0]));
                        member.message = records[i].message;
                        members.push(member);
                    })
                    .catch(err => console.log(err))
            }
            res.render('expertsMember', { title: "My Members", members, isExpert: req.user.isExpert })
        })
        .catch(err => console.log(err))
}

// Service for Members page
const loadMembersService = (req, res) => {
    let currUserID = req.user._id;

    Member.find({ userID: currUserID })
        .then(records => {
            let members = records;
            userExpert.find({ userID: currUserID })
                .then(records => {
                    let experts = records;
                    res.render('members', { title: "Members", members, experts });
                })
                .catch(err => {
                    console.log(err);
                    let experts = [];
                    res.render('members', { title: "Members", members, experts });
                })
            // res.render('members', { title: "Members", members });
        })
        .catch(err => console.log(err))
}

// Delete Expert Member
const deleteExpertMemberService = (req, res) => {
    let memberId = req.body.id;
    ExpertMember.deleteOne({ memberId },)
        .then(records => {
            res.json({ success: "Deleted Member!" });
        })
        .catch(err => console.log(err))
}

// Update Member Details
const updateMemberService = (req, res) => {
    let currUserID = req.user._id;

    // Object destructuring 
    const { firstName, lastName, gender, address, age, description, id } = req.body;
    let errors = [];

    // Check for required fields
    if (!firstName || !lastName || !gender || !address || !age) {
        errors.push({ msg: "Please fill in all the fields" })
    }
    // If there's an error re render the registraion page
    if (errors.length > 0) {
        res.status(400);
        res.json({
            errors,
            firstName,
            lastName,
            gender,
            address,
            age
        })
    } else {
        Member.findOneAndUpdate({ _id: id, userID: currUserID }, { $set: { firstName, lastName, gender, address, age, description } })
            .then(records => {
                res.status(200);
                res.json({ success: "Updated Member Details!" });
            })
            .catch(err => console.log(err))
    }
}

// Delete Member
const deleteMemberService = (req, res) => {
    let currUserID = req.user._id;
    let id = req.body.id;

    Member.deleteOne({ _id: id, userID: currUserID },)
        .then(records => {
            res.json({ success: "Deleted Member!" });
        })
        .catch(err => console.log(err))
}

// Service for Add userExperts
const addUserExpertService = (req, res) => {
    let currUserID = req.user._id;
    userExpert.find({ userID: currUserID })
        .then(records => {
            let experts = records;

            // Object destructuring 
            const { firstName, lastName, email, phone, address, description } = req.body;
            //console.log(req.body)
            let errors = [];

            // Check for required fields
            if (!firstName || !lastName || !email || !phone || !address) {
                errors.push({ msg: "Please fill in all the fields" })
            }

            // If there's an error re render the registraion page
            if (errors.length > 0) {
                res.json({
                    errors,
                    experts,
                    firstName,
                    lastName,
                    email,
                    phone,
                    address,
                    description,
                    title: "userExpert Register"
                })
            } else {
                // When the validation passed
                userExpert.findOne({ email: email, user: currUserID })
                    .then(expert => {
                        if (expert) {
                            // if there's a user rerender the register form
                            errors.push({ msg: 'name is already registered' })
                            res.json({
                                errors,
                                experts,
                                firstName,
                                lastName,
                                email,
                                phone,
                                address,
                                description,
                                title: "userExpert Register"
                            });
                        } else {
                            const newuserExpert = new userExpert({
                                firstName,
                                lastName,
                                email,
                                phone,
                                address,
                                description,
                                userID: currUserID
                            });
                            newuserExpert.save()
                                .then(expert => {
                                    let success = [];
                                    success.push({ msg: 'Registered' })
                                    if (success.length > 0) {
                                        res.json({
                                            firstName,
                                            lastName,
                                            email,
                                            phone,
                                            address,
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

// Service for Get userExperts
const loadUserExpertsService = (req, res) => {
    let currUserID = req.user._id;
    userExpert.find({ userID: currUserID })
        .then(records => {
            let experts = records;
            res.render('experts', { title: "Experts", experts });
        })
        .catch(err => console.log(err))
}

// Service for updating userExpert
const updateUserExpertService = (req, res) => {
    let currUserID = req.user._id;

    // Object destructuring 
    const { firstName, lastName, email, phone, address, description, id } = req.body;
    let errors = [];

    // Check for required fields
    if (!firstName || !lastName || !email || !phone || !address) {
        errors.push({ msg: "Please fill in all the fields" })
    }
    // If there's an error re render the registraion page
    if (errors.length > 0) {
        res.status(400);
        res.json({
            errors,
            firstName,
            lastName,
            email,
            phone,
            address,
            description
        })
    } else {
        userExpert.findOneAndUpdate({ _id: id, userID: currUserID }, { $set: { firstName, lastName, email, phone, address, description } })
            .then(records => {
                res.status(200);
                res.json({ success: "Updated userExpert Details!" });
            })
            .catch(err => console.log(err))
    }
}

// Service for Delete userExpert
const deleteUserExpertService = (req, res) => {
    let currUserID = req.user._id;
    let id = req.body.id;

    userExpert.deleteOne({ _id: id, userID: currUserID })
        .then(records => {
            res.json({ success: "Deleted userExpert!" });
        })
        .catch(err => console.log(err))
}

// updateMemberVideoURL Service
const updateMemberVideoURLService = (req, res) => {
    const { userId, memberId, Location } = req.body;
    Member.findOneAndUpdate({ _id: memberId, userID: userId }, { $set: { videoURL: Location } }, { returnOriginal: false })
        .then(record => {
            // console.log(record);
            res.status(200).send("Success!");
        })
        .catch(err => {
            res.status(400).send("Failed!");
            console.log(err)
        })
}

// Passport service for log in
const userLoginService = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        // console.log(user)
        if (err) {
            return next(err);
        }
        if (!user) {
            passport.authenticate('expert-local', function (err, user, info) {
                // console.log(user)
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
                    return res.redirect('/users/experts/Login');
                });

            })(req, res, next);
            return
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

// Update Account details service
const updateAccountDetailsService = (req, res) => {
    let currUserID = req.user._id;
    // Object destructuring 
    const { firstName, lastName, phone } = req.body
    let errors = [];

    // Check for required fields
    if (!firstName || !lastName || !phone) {
        errors.push({ msg: "Please fill in all the fields" })
    }

    // Phone number lenth
    if (isNaN(phone) || phone.length != 10) {
        errors.push({ msg: 'Phone number is incorrect ' })
    }

    // If there's an error re-render the registraion page
    if (errors.length > 0) {

        res.status(400)
        res.json({
            'statusMessage': "Fail",
            errors,
            firstName,
            lastName,
            phone
        })

    } else {
        User.findOneAndUpdate({ _id: currUserID }, { $set: { firstName, lastName, phone } })
            .then(records => {
                res.status(200);
                res.json({ success: "Updated Account Details!" });
            })
            .catch(err => console.log(err))
    }
}

// Expert Account Settings service
const expertsAccountSettingsService = (req, res) => {
    res.render('expertsAccountSettings', {
        title: "Account Settings",
        id: req.user._id.toString(),
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        isExpert: req.user.isExpert
    })
}

// Update Expert's Account details service
const updateExpertsAccountDetailsService = (req, res) => {
    let currUserID = req.user._id;
    // Object destructuring 
    const { firstName, lastName, phone } = req.body
    let errors = [];

    // Check for required fields
    if (!firstName || !lastName || !phone) {
        errors.push({ msg: "Please fill in all the fields" })
    }

    // Phone number lenth
    if (isNaN(phone) || phone.length != 10) {
        errors.push({ msg: 'Phone number is incorrect ' })
    }

    // If there's an error re-render the registraion page
    if (errors.length > 0) {
        res.status(400)
        res.json({
            'statusMessage': "Fail",
            errors,
            firstName,
            lastName,
            phone
        })

    } else {
        Expert.findOneAndUpdate({ _id: currUserID }, { $set: { firstName, lastName, phone } })
            .then(records => {
                res.status(200);
                res.json({ success: "Updated Account Details!" });
            })
            .catch(err => console.log(err))
    }
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
                    exports.token = token;
                    const output = `<p> Hello ${member.firstName} ${member.lastName} please click the link bellow to reset password</p>
                    <a href="${ROOT_URL}/users/passwordReset/${token}">Click Here</a>`


                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: "smtpout.secureserver.net",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'official@saife.app', // generated ethereal user
                            pass: 'Official123!', // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    // send mail with defined transport object
                    let mailOptions = {
                        from: '"SAIFE App" <official@saife.app>', // sender address
                        to: member.email, // list of receivers
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

                    res.json({
                        statusCode: 400,
                        errors,
                        email
                    })
                }
            })
    }

}

// Email password handle
const userEmailPasswordService = (req, res) => {
    const resetLink = req.params.id;

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
                } else {
                    return res.render('passwordReset', { title: "Reset Password", resetLink: resetLink })
                }
            })
        })
    }


}

// Password reset services 
const userResetPasswordService = (req, res) => {
    const { resetLink, newPassword } = req.body
    // Verify if the resetLink is the same 
    console.log(resetLink)
    console.log(newPassword)
    if (resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired"
                })
            }
            User.findOne({ resetLink }, (err, user) => {
                if (err || !user) {
                    return res.json({ error: "User with this token does not exist" })
                }

                // Hash Password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) {
                            throw err
                        }
                        // Set password to hashed
                        user.password = hash
                        user.resetLink = ''

                        user.save((err, result) => {
                            if (err) {
                                return res.json({ error: "Reset password error" })
                            }
                            else {
                                return res.status(200).json({ msg: "Your password has been changed" })

                            }
                        })
                    }))



            })
        })
    } else {
        return res.status(200).json({ error: "Authentication errror!!!" })
    }
}

const userFallDetectedService = (req, res) => {
    // Object destructuring 
    const { userId, memberId } = req.body

    Member.findOneAndUpdate({ _id: new mongoose.mongo.ObjectId(memberId) }, { $set: { status: true } })
        .then(record => {
            if (record) {
                console.log("fall status saved! ", record);
                res.status(200);
                sendPushService(req, res);
            }
        })
        .catch(err => console.log(err))
}

// triggerPush = (req, res) => {
//     const { userId, memberId } = req.body
//     console.log(userId);
//     const requestOptions = {
//         url: 'http://localhost:3000/users/sendPush',
//         method: 'POST',
//         json: { "_id": userId }
//     };
//     request(
//         requestOptions,
//         (err, response, body) => {
//             if (err) {
//                 console.log("Failed Invoking POST sendPush ", err)
//                 res.status(400).send("Failed!");
//             } else {
//                 console.log("Successfully called POST sendPush ", body)
//                 res.status(200).send(data);
//             }
//         }
//     );
// }

const sendPushService = async (req, res) => {
    try {
        // Get pushSubscription from the db
        if (req.body.isExpert === true) {
            var { email, memberId, videoLink, message, isExpert } = req.body;
            var _id;
            await Expert.findOne({ email: email })
                .then(expert => {              
                    _id = expert._id
                })

            var currentUser = Expert;
            var payload = JSON.stringify({ title: 'Notification from SAIFE', _id, memberId, videoLink, message, isExpert });
        } else {
            var currentUser = User;
            var payload = JSON.stringify({ title: 'Notification from SAIFE'});
            const { userId, memberId } = req.body
            var _id = userId;
        }
        console.log("Current Id",_id)
        currentUser.findOne({ _id: new mongoose.mongo.ObjectId(_id) })
            .then(user => {

                if (user.pushSubObj) {
                    res.status(200).json({});
                    console.log("Sending Push...");
                    // Pass object into sendNotification
                    webpush.sendNotification(JSON.parse(user.pushSubObj), payload)
                        .catch(err => {
                            console.log(err);
                            res.status(410).json({ statusMessage: "Expired" });
                        });
                }
                else {
                    console.log("No Push Subscription Object Found!")
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
        catch(err) {
            console.log(err);
        }


}

// View Video service
const viewVideoService = (req, res) => {
    res.render('viewVideo', {
        title: "View Video"
    })
}

// Reset Member Fall Status Service
const resetStatusService = (req, res) => {
    // Object destructuring 
    const { memberId } = req.body;

    Member.findOneAndUpdate({ _id: new mongoose.mongo.ObjectId(memberId) }, { $set: { status: false } })
        .then(record => {
            if (record) {
                res.status(200).send("fall status reset success!");
            }
        })
        .catch(err => console.log(err))
}

// Forward Member to Expert Service
const forwardCaseService = (req, res) => {
    const isExpert = true;
    req.body.isExpert = isExpert;
    sendPushService(req, res)

}

module.exports = {
    registerUserService,
    registerMemberService,
    loadMembersService,
    userLoginService,
    userLogoutService,
    userAccountSettingsService,
    updateAccountDetailsService,
    expertsAccountSettingsService,
    updateExpertsAccountDetailsService,
    userFogotPasswordService,
    userEmailPasswordService,
    userResetPasswordService,
    updateMemberService,
    deleteMemberService,
    userFallDetectedService,
    viewVideoService,
    sendPushService,
    updateMemberVideoURLService,
    loadUserExpertsService,
    deleteExpertMemberService,
    addUserExpertService,
    updateUserExpertService,
    deleteUserExpertService,
    resetStatusService,
    loadExpertMembersService,
    forwardCaseService
}