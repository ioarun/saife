const express = require('express');
const router = express.Router();
const Controllers = require('../controllers')
const { ensureAuthenticated } = require('../config/auth');
const Services = require('../services')
const token = Services.token

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

module.exports = router;