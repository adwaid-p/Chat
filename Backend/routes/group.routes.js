const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const upload = require('../middlewares/multer.middlewares')


router.post('/createGroup',groupController.createGroup)

router.get('/getGroups',groupController.getGroups)

router.get('/fetch_message',groupController.fetchGroupMessage)

router.post('/update_members',groupController.updateGroupMembers)

router.post('/profile_pic',upload.single('profilePic'),groupController.updateProfilePic)

module.exports = router