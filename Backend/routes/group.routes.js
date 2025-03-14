const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.post('/createGroup',groupController.createGroup)

router.get('/getGroups',groupController.getGroups)

router.get('/fetch_message',groupController.fetchGroupMessage)

router.post('/update_members',groupController.updateGroupMembers)

module.exports = router