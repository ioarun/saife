const mongoose = require('mongoose')

// Create Schema
const MemberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
    

})


const Member = mongoose.model('Member',MemberSchema)

module.exports = Member