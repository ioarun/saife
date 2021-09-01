require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')

const app = express()

// DB config
const db = require('./config/keys').MongoURI

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(()=>console.log('MongoDB connected....'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000

// Routes
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

app.use('/', indexRoutes)
app.use('/users', userRoutes );

app.listen(PORT,console.log(`server started on port ${PORT}`))