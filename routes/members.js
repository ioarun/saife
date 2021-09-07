const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose')

//members array
var members = [
    {
        firstName: "Gouri Nandan",
        lastName: "Gangavaram!",
        emailID: "G@gmail.com",
        memberID: "G - ID",
        gender: "M",
        address: "G Test Address",
        description: "G Test Description",
        status: "Fallen!",
        age:33
    },
    {
        firstName: "Arun",
        lastName: "A!",
        emailID: "A@gmail.com",
        memberID: "A - ID",
        gender: "M",
        address: "A Test Address",
        description: "A Test Description",
        status: "All Good!",
        age:32
    },
    {
        firstName: "Sodi",
        lastName: "S!",
        emailID: "S@gmail.com",
        memberID: "S - ID",
        gender: "M",
        address: "S Test Address",
        description: "S Test Description",
        status: "Fallen!",
        age:31
    },
    {
        firstName: "Chasham",
        lastName: "C!",
        emailID: "C@gmail.com",
        memberID: "C - ID",
        gender: "F",
        address: "C Test Address",
        description: "C Test Description",
        status: "All Good!",
        age:34
    }
];

// Get Members
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('members', {title: "Members", members});
});

// Add Member
router.post('/addMember', ensureAuthenticated, (req, res) => {
    let member = req.body;
    member.status = "All Good!";
    members.push(member);
    res.render('members', {title: "Members", members});
});

// Rgister handle for member
router.get('/myMembers',ensureAuthenticated,(req,res)=>{
        
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