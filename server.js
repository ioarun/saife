require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('connect-flash') // Connect flash
const session = require('express-session') // Connect session
const passport = require('passport')

const app = express()

// Passport Config
require('./config/passport')(passport)

// DB config
const db = require('./config/keys').MongoURI

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected....'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser (can get data from form using request.body)
app.use(express.urlencoded({ extended: true }))

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    next()
})

const PORT = process.env.PORT || 5000

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`server started on port ${PORT}`))