require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000

// Routes
const routes = require('./routes/index')
app.use('/', routes)
app.use('/users', require('./routes/users'));

app.use('/members',  require('./routes/members'))

app.listen(PORT,console.log(`server started on port ${PORT}`))