const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        // unique : true,
        required : true 
    },
    email : {
        type : String,
        // unique : true,
        required : true,
        minlength : [5, 'Email must be atleast 5 charecter long']
    },
    password : {
        type : String,
        required : true,
        minlength : [4, 'Password must be 4 charecter long'],
        select : false,
    },
    profilePic : {
        type : String,
        default : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        required : true,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isOnline : {
        type : Boolean,
        default : false
    },
    lastSeen : {
        type : Date,
        default : Date.now
    },
    // lastSeenMessage : {
    //     type : String,
    //     default : 'No message'
    // },
    socketId : {
        type : String,
    }
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel