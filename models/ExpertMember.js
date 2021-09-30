const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Create Schema
const expertMemberSchema = new mongoose.Schema({
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
    date: {
        type: String,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: 0
    },
    videoURL: {
        type: String,
        required: false
    },
    expertID: {
        type: ObjectId,
        required: true
    }
})


const ExpertMember = mongoose.model('ExpertMember',expertMemberSchema)

module.exports = ExpertMember