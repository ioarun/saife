const mongoose = require('mongoose')

// Create Schema
const MemberSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
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
    date: {
        type: String,
        default: Date.now
    }
    

})


const Member = mongoose.model('Member',MemberSchema)

module.exports = Member