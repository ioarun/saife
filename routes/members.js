const express = require('express');
const router = express.Router();

// Members Page
router.get('/', (req, res) => {
    let members = [
        {
            name: "Gouri Nandan",
            age: "38"
        },
        {
            name: "Arun",
            age: "36"
        },
        {
            name: "Sodi",
            age: "35"
        },
        {
            name: "Chasham",
            age: "33"
        }
    ];
    res.render('members', {title: "Members", members});
});

module.exports = router;