const express = require('express');
const router = express.Router();

// Members Page
router.get('/', (req, res) => {
    let members = [
        {
            name: "Gouri Nandan",
            status: "Fallen!"
        },
        {
            name: "Arun",
            status: "All Good!"
        },
        {
            name: "Sodi",
            status: "All Good!"
        },
        {
            name: "Chasham",
            status: "All Good!"
        }
    ];
    res.render('members', {title: "Members", members});
});

module.exports = router;