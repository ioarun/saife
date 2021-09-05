const mongoose = require('mongoose')

// DB config
const db = require('./config/keys').MongoURI

// Connect to mongo

const mongo = () => {
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log('MongoDB connected....'))
        .catch(err => console.log(err))
}

const close = () => {
    mongoose.disconnect()
}

module.exports =  mongo, close 


