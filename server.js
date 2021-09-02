require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

// // Body parser middleware
// app.use(bodyParser.json());



// // Push
const publicVapidKey = "BOHjA_8rowVAwIEwllMoc5ha_NJEYepUvXAyArv4886enG1hzvIxGSn-v3Lr3koyDlvYxmU1M8HKgbvcHhTc95Y";
const privateVapidKey = "Jj7jBQ2Q9kdKFEqJC5-KtTTMN8SK8bzLIMcexm8q3rQ";

webpush.setVapidDetails('mailto:push@saife.com', publicVapidKey, privateVapidKey);

// Subscribe Route
app.post('/subscribe', (req, res) => {
    // Get pushSubscription object from client
    const subscription = req.body;

    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({title: 'Push test'});

    console.log(req);

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(err => console.log(err));
})

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000

//set the static path to push worker
app.use(express.static('push'));
app.use('/push', express.static('push'));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.listen(PORT,console.log(`server started on port ${PORT}`))
