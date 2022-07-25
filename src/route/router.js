const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const eventController = require('../controller/eventController')


router.post('/createUser', userController.createUserData)
router.post('/login', userController.loginUser)




module.exports=router