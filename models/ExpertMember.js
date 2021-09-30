const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Creating schema for user Expert Members for experts/myMembers Page
const expertMemberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    memberID: {
        type: ObjectId,
        required: true
    }
})


const ExpertMember = mongoose.model('ExpertMember',expertMemberSchema)

module.exports = ExpertMember