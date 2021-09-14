const bcrypt = require('bcryptjs')
const passport = require('passport')
const Services = require('../services')

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
        Services.projectServices.registerUserService(req,res,errors)

    }
}

// Register member handle 
const registerMember = (req, res) => {
    Services.projectServices.registerMemberService(req,res)
}

// Members page
const loadMembers = (req, res) => {
    Services.projectServices.loadMembersService(req,res)
}

// Login handle
const userLogin = (req, res, next) => {
    Services.projectServices.userLoginService(req,res,next)
}

// Logout handle
const userLogout = (req, res) => {
    Services.projectServices.userLogoutService(req,res)
}

// User account page
const userAccountSettings = (req, res) => {
    Services.projectServices.userAccountSettingsService(req,res)
}

// Fogot password handle
const fogotPassword = (req,res)=>{
    Services.projectServices.userFogotPasswordService(req,res)
}

// Handle for email link 
const emailPassword =(req,res)=>{
    Services.projectServices.userEmailPasswordService(req,res)
}

// Password reset handle
const resetPassword =(req,res)=>{
    Services.projectServices.userResetPasswordService(req,res)
}
module.exports = {
    registerUser,
    registerMember,
    loadMembers,
    userLogin,
    userLogout,
    userAccountSettings,
    fogotPassword,
    emailPassword,
    resetPassword
};