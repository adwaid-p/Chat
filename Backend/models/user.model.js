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
    socketId : {
        type : String,
    }
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel