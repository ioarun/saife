const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => res.send('Hello again!'))
router.get('/', (req, res) => res.render('userHome'));


module.exports = router