const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    console.log('token:',token)
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    try{
        console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        console.log('decoded:',decoded)

        const user = await userModel.findById(decoded._id)

        console.log('the user:',user)

        req.user = user

        return next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Unauthorized" });
    }

}