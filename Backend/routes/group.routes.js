const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.post('/createGroup',groupController.createGroup)

module.exports = router