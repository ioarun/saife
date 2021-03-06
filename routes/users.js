const express = require('express');
const router = express.Router();
const Controllers = require('../controllers')
const { ensureAuthenticated } = require('../config/auth');
const Services = require('../services')
const token = Services.token
const passport = require('passport')
const bcrypt = require('bcryptjs')
// ExpertMember Model
const ExpertMember = require('../models/ExpertMember') 

// Expert Model
const Expert = require('../models/Expert')

// User Model
const User = require('../models/User')

// Member Model
const Member = require('../models/Member');
const services = require('../services');

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
    Controllers.projectController.registerUser(req, res)
})

// Members Page
router.get('/myMembers', ensureAuthenticated, (req, res) => {
    Controllers.projectController.loadMembers(req, res)
});

// Register handle for member
router.post('/myMembers', ensureAuthenticated, (req, res) => {
    Controllers.projectController.registerMember(req, res)
})

// update handle for member
router.put('/myMembers', ensureAuthenticated, (req, res) => {
    Controllers.projectController.updateMember(req, res)
})

// Delete handle for member
router.delete('/myMembers', ensureAuthenticated, (req, res) => {
    Controllers.projectController.deleteMember(req, res)
})

// Get userExperts
router.get('/myExperts', ensureAuthenticated, (req, res) => {
    Controllers.projectController.loadUserExperts(req, res)
});

// Add userExpert
router.post('/myExperts', ensureAuthenticated, (req, res) => {
    Controllers.projectController.addUserExpert(req, res)
});

// Update userExpert
router.put('/myExperts', ensureAuthenticated, (req, res) => {
    Controllers.projectController.updateUserExpert(req, res)
});

// Delete userExpert
router.delete('/myExperts', ensureAuthenticated, (req, res) => {
    Controllers.projectController.deleteUserExpert(req, res)
});

// Login handle
router.post('/login', (req, res, next) => {
    Controllers.projectController.userLogin(req, res, next)
});

// Logout handle
router.get('/logout', (req, res) => {
    Controllers.projectController.userLogout(req, res)
})

// User Accounts Page
router.get('/userAccountSettings', ensureAuthenticated, (req, res) => {
    Controllers.projectController.userAccountSettings(req, res)
})

// update handle for member
router.put('/userAccountSettings', ensureAuthenticated, (req, res) => {
    Controllers.projectController.updateAccountDetails(req, res)
})


// Fall detected
router.post('/fallDetected', (req, res, next) => {
    Controllers.projectController.fallDetected(req, res)
})

// Push Route
router.post('/sendPush', (req, res) => {
    Controllers.projectController.sendPush(req, res)
})
// Reset password handle
// router.post('/password',(req,res)=>{
//     Controllers.projectController.resetPassword(req,res)
// })

// Password reset email link
router.put('/password',(req,res)=>{
    Controllers.projectController.fogotPassword(req,res)
})
router.get('/passwordReset/:id',(req,res)=>{
    Controllers.projectController.emailPassword(req,res)
    
})
router.put('/passwordReset/',(req,res)=>{
    Controllers.projectController.resetPassword(req,res)
    
})

router.get('/viewVideo',(req,res)=>{
    Controllers.projectController.viewVideo(req,res)
    
})
//Update Member video URL from Ground Station
router.put('/updateMemberVideoURL',(req,res)=>{
    Controllers.projectController.updateMemberVideoURL(req,res)
});

// Expert Login Page
router.get('/experts/Login',ensureAuthenticated, (req, res, next) => {
    let fullname = req.user.firstName + " " + req.user.lastName
    // console.log(req.user.isExpert)
    const isExpert = req.user.isExpert
    Expert.findOne({ _id: req.user._id })
            .then(user => {
                // Check if push subscription object is undefined (push is not registered)
                if (user.pushSubObj){
                    res.render('expertRegister', {
                        isExpert,
                        title: "Expert Dashboard",
                        firstName: user.firstName,
                        lastName:user.lastName,
                        registration:user.registration,
                        phone:user.phone
                    });
                }else{
                    res.render('expertRegister', {
                        id: user._id.toString(),
                        isExpert,
                        title: "Expert Dashboard",
                        firstName: user.firstName,
                        lastName:user.lastName,
                        registration:user.registration,
                        phone:user.phone,
                    });
                }  
            });
})
// Expert register Page 
router.post('/experts/Register', (req, res, next) => {
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

// Expert members page
router.get('/experts/myMembers', ensureAuthenticated,(req,res)=>{
    Controllers.projectController.loadExpertMembers(req, res);
})

// Delete Expert Member
router.delete('/experts/myMembers', ensureAuthenticated,(req,res)=>{
    Controllers.projectController.deleteExpertMember(req, res);
})

// Experts account settings page
router.get('/experts/expertsAccountSettings', ensureAuthenticated,(req,res)=>{
    Controllers.projectController.expertsAccountSettings(req, res);
})

// update account settings for Experts
router.put('/experts/expertsAccountSettings', ensureAuthenticated, (req, res) => {
    Controllers.projectController.updateExpertsAccountDetails(req, res);
})

//Reset Member Fall Status
router.put('/resetStatus', ensureAuthenticated,(req,res)=>{
    Controllers.projectController.resetStatus(req,res)
});

// Forward MemberID to Expert
router.post('/forwardCase', ensureAuthenticated,(req,res)=>{
    Controllers.projectController.forwardCase(req, res);
})

// Save videolink in db link
router.post('/saveVideoLink',ensureAuthenticated,(req,res)=>{

        const {expertId,memberId,videoLink,message}= req.body
             
        ExpertMember.findOneAndUpdate({ expertId: expertId, memberId: memberId},
        {$set: {
            videoLink:videoLink,
            message: message,
            memberId: memberId,
            expertId: expertId      
        }},
        {upsert:true, returnNewDocument: true})
    .then(record => {
                let success = [];
                success.push({ msg: 'Forwarded' })
                if (success.length > 0) {
                    res.json({
                   
                        memberId, 
                        message: "Success!"
                    })
                }
        })
    .catch(err => console.log(err));
})
module.exports = router;