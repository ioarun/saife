const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Hello again!'))

module.exports = router