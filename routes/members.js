const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose')


const Member = require('../models/Member')
// Members Page
router.get('/myMembers',ensureAuthenticated, (req, res) => {
    let members = [
    ];
    res.render('members', {title: "Members", members});
});

// Rgister handle for member
router.post('/myMembers',ensureAuthenticated,(req,res)=>{
        
        Member.find({})
        .then(records=>{
            let members = records
            
            // Object destructuring 
            const { firstname, lastname, email, phone } = req.body
            let errors = [];
     
            // Check for required fields
            if (!firstname || !lastname || !email || !phone ) {
                errors.push({ msg: "Please fill in all the fields" })
            }
        
            // Phone number lenth
            if(isNaN(phone) || phone.length !=10){
                errors.push({msg:'Phone number is incorrect '})
            }
        
            // If there's an error re render the registraion page
            if (errors.length > 0) {
                res.render('members', {
                    errors,
                    members,
                    firstname,
                    lastname,
                    email,
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
                                firstname,
                                lastname,
                                email,
                                phone,                           
                                title: "Member Register"
                            })
                        } else {
                            const newMember = new Member({
                                firstname,
                                lastname,
                                email,
                                phone
                            });
                            newMember.save()
                                     .then(member => {
                                         req.flash('success_msg', 'New user saved successfully')
                                         res.render('members',{title: "Dashboard",members})
                                     })
                                     .catch(err => console.log(err))
        
                         
                        }
                    })
        
            }}).catch(err => console.log(err))

        
})


module.exports = router;