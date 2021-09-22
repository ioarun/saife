const mongoose = require('mongoose')
const Schema = mongoose.Schema;


// Create Schema
const ExpertSchema = new mongoose.Schema({
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
    }
})


const Expert = mongoose.model('Expert',ExpertSchema)

module.exports = Expert