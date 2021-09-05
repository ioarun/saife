const express = require('express');
const router = express.Router();

//members array
var members = [
    {
        firstName: "Gouri Nandan",
        status: "Fallen!"
    },
    {
        firstName: "Arun",
        status: "All Good!"
    },
    {
        firstName: "Sodi",
        status: "Fallen!"
    },
    {
        firstName: "Chasham",
        status: "All Good!"
    }
];

// Get Members
router.get('/', (req, res) => {
    res.render('members', {title: "Members", members});
});

// Add Member
router.post('/addMember', (req, res) => {
    let member = req.body;
    member.status = "All Good!";
    members.push(member);
    res.render('members', {title: "Members", members});
});

module.exports = router;