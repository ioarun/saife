const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose')
const Services = require('../services')

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

    // If there's an error re-render the registraion page
    if (errors.length > 0) {
        console.log(errors) 
        res.status(201)
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

// Update Member Details
const updateMember = (req,res) => {
    Services.projectServices.updateMemberService(req,res)
}

// Delete Member
const deleteMember = (req,res) => {
    Services.projectServices.deleteMemberService(req,res)
}

// Expert Member page
const loadExpertMembers = (req, res) => {
    Services.projectServices.loadExpertMembersService(req,res)
}

// Delete Expert Member
const deleteExpertMember = (req, res) => {
    Services.projectServices.deleteExpertMemberService(req,res)
}

// Get userExperts
const loadUserExperts = (req, res) => {
    Services.projectServices.loadUserExpertsService(req,res)
}

// Add userExpert
const addUserExpert = (req, res) => {
    Services.projectServices.addUserExpertService(req,res)
}

// Update userExpert
const updateUserExpert = (req, res) => {
    Services.projectServices.updateUserExpertService(req,res)
}

// Delete userExpert
const deleteUserExpert = (req, res) => {
    Services.projectServices.deleteUserExpertService(req,res)
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

// Update user's account details
const updateAccountDetails = (req, res) => {
    Services.projectServices.updateAccountDetailsService(req,res)
}

// Experts account Settings Page
const expertsAccountSettings = (req, res) => {
    Services.projectServices.expertsAccountSettingsService(req,res)
}

// UpdateExpert's Account Details
const updateExpertsAccountDetails = (req, res) => {
    Services.projectServices.updateExpertsAccountDetailsService(req,res)
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

// Fall detected
const fallDetected = (req, res) => {
    Services.projectServices.userFallDetectedService(req, res)  
}

// Send Push
const sendPush = (req, res) => {
    Services.projectServices.sendPushService(req, res)
}

// View video handle
const viewVideo = (req, res) => {
    Services.projectServices.viewVideoService(req,res)
}

// updateMemberVideoURL
const updateMemberVideoURL = (req, res) => {
    Services.projectServices.updateMemberVideoURLService(req,res)    
}

// resetStatus
const resetStatus = (req, res) => {
    Services.projectServices.resetStatusService(req,res)    
}

// forwardCase to Expert
const forwardCase = (req, res) => {
    Services.projectServices.forwardCaseService(req,res)    
}

module.exports = {
    registerUser,
    registerMember,
    loadMembers,
    updateMember,
    deleteMember,
    loadExpertMembers,
    deleteExpertMember,
    userLogin,
    userLogout,
    userAccountSettings,
    updateAccountDetails,
    expertsAccountSettings,
    updateExpertsAccountDetails,
    fallDetected,
    sendPush,
    fogotPassword,
    emailPassword,
    resetPassword,
    viewVideo,
    updateMemberVideoURL,
    loadUserExperts,
    addUserExpert,
    updateUserExpert,
    deleteUserExpert,
    resetStatus,
    forwardCase
};