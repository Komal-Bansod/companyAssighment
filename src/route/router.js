const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const eventController = require('../controller/eventController')
const middleware = require('../middelware/auth')


router.post('/createUser', userController.createUserData)
router.post('/login', userController.loginUser)
router.put('/logout', userController.logOut)
router.put('/resetPassword/:userId', userController.resetPassword)


/////////////
router.post('/createEvent',middleware.authentication, eventController.createEvent)
router.get('/eventDetails/:eventId',middleware.authentication,middleware.authorisation, eventController.getEventById)
router.get('/events', eventController.getEvent)
router.put('/updateEvent/:eventId',middleware.authentication,middleware.authorisation, eventController.updateEvent)






module.exports=router