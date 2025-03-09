const mongoose = require('mongoose')

const groupMessageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('GroupMessage',groupMessageSchema)