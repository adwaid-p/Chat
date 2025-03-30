const userModel = require('../models/user.model')

module.exports.createUser = async({userName,email,password, language}) => {
    if(!userName || !email || !password || !language){
        throw new Error('All fields are required')
    }
    const user = userModel.create({userName,email,password, language})
    return user
}