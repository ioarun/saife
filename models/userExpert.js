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
    registration: {
        type: Number,
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
    password: {
        type: String,
        required: true
    },
    pushSubObj: {
        type: Object,
        required: false
    },
    date: {
        type: String,
        default: Date.now
    },
    resetLink:{
        data: String,
        default:''
    },
    isExpert:{
        type:Boolean,
        default:true
    },
    userID: {
        type: ObjectId,
        required: true
    }
})


const userExpert = mongoose.model('userExpert',userExpertSchema)

module.exports = userExpert