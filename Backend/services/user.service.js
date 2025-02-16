const userModel = require('../models/user.model')

module.exports.createUser = async({userName,email,password}) => {
    if(!userName || !email || !password){
        throw new Error('All fields are required')
    }
    const user = userModel.create({userName,email,password})
    return user
}