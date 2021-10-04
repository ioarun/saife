const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Creating schema for user Expert Members for experts/myMembers Page
const expertMemberSchema = new mongoose.Schema({
    expertId: {
        type: ObjectId,
        required: true
    },
    videoLink: {
        type: String,
        required: false
    },
    memberId: {
        type: ObjectId,
        required: true
    },
    message:{
        type:String,
        required:false
    }
})


const ExpertMember = mongoose.model('ExpertMember',expertMemberSchema)

module.exports = ExpertMember