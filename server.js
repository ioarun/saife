require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash') // Connect flash
const session = require('express-session') // Connect session
const passport = require('passport')

const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require("path");
const mongo = require('./dbconnect')
var mongoose = require('mongoose');

// User Model
const User = require('./models/User')

const app = express();

// // Body parser middleware
app.use(bodyParser.json());


// // Push
const publicVapidKey = "BOHjA_8rowVAwIEwllMoc5ha_NJEYepUvXAyArv4886enG1hzvIxGSn-v3Lr3koyDlvYxmU1M8HKgbvcHhTc95Y";
const privateVapidKey = "Jj7jBQ2Q9kdKFEqJC5-KtTTMN8SK8bzLIMcexm8q3rQ";

webpush.setVapidDetails('mailto:push@saife.com', publicVapidKey, privateVapidKey);

// Subscribe Route
app.post('/subscribe', (req, res) => {
    console.log(res.statusCode);
    
    // Get pushSubscription object from client
    const subscription = req.body;
    // Send 201 - resource created
    // res.status(201).json({});
    // console.log(JSON.stringify(subscription));
    // Save the subscription object in the database
    userId = new mongoose.mongo.ObjectId(subscription.id);
    User.findByIdAndUpdate(userId, 
        {pushSubObj: subscription.pushSubObj}, function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                // res.send(data);
                // console.log("pushSubObj updated! id : ", userId);
                
            }
        });
    res.status(201).json({statusMessage: "Subscribed"}); 
})

// Push Route
app.post('/sendPush', (req, res) => {
    console.log(req.body._id);
    // Get pushSubscription from the db
    User.findOne({ _id: new mongoose.mongo.ObjectId(req.body._id) })
            .then(user => {
                // Check if push subscription object is undefined (push is not registered)
                // console.log(user._id.toString());
                if (user.pushSubObj){
                    
                    // const subscription = req.body;
                    // Send 200
                    // res.status(200).json({});

                    // Create payload
                    const payload = JSON.stringify({title: 'Notification from SAIFE'});
                    console.log(user.pushSubObj);
                    console.log("Sending Push...");
                    // Pass object into sendNotification
                    webpush.sendNotification(JSON.parse(user.pushSubObj), payload)
                    .catch(err => {
                        console.log(err);
                        res.status(410).json({statusMessage: "Expired"}); 
                    });
                } 
                else {
                    console.log("No Push Subscription Object Found!")
                }  
            })
            .catch(err => {
                console.log(err);
            });
        
    
})

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Passport Config
require('./config/passport')(passport)


// Connect to mongo
mongo();

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

const PORT = process.env.PORT || 3000


// Static files access
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

// Routes

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/experts',require('./routes/experts.js'));

// app.use('/myMembers', require('./routes/members.js'));


// https://stackoverflow.com/questions/56308581/uncaught-error-listen-eaddrinuse-address-already-in-use-3000-when-mocha-uni
if(!module.parent){
    app.listen(PORT, () =>
      console.log(`server listening on port ${PORT}!`),
    );
  }

// app.listen(PORT,console.log(`server started on port ${PORT}`));

// app.listen(5000,'192.168.0.177',function(){
//     console.log('Server running at http://127.0.1.1:8000/')
//   })
module.exports = app;