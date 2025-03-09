const groupMessageModel = require('../models/groupMessage.model');

module.exports.createGroup = async (req, res, next) => {
    try {
        const { name , members, createdBy } = req.body;

        if(!name || !members || !createdBy){
            return res.status(400).json({ message: 'All fields are required'})
        }
        const newGroup = await groupMessageModel.create({ name , members, createdBy })
        return res.status(201).json(newGroup)
    } catch (error) {
        console.log('Error in creating group is : ', error.message)
        return res.status(400).json({ message: 'Server error'})
    }
}