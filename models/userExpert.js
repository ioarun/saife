const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


// Create Schema
const userExpertSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    userID: {
        type: ObjectId,
        required: true
    }
})


const userExpert = mongoose.model('userExpert',userExpertSchema)

module.exports = userExpert