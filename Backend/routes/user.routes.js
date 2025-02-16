const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const {body} = require('express-validator')

router.post('/register', [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({min : 4}).withMessage('Password must be atleast 4')
    ]
    ,userController.registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min : 4}).withMessage('Password must be atleast 4')
],
userController.loginUser)

module.exports = router