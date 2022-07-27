const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const eventController = require('../controller/eventController')
const middleware = require('../middelware/auth')


router.post('/createUser', userController.createUserData)
router.post('/login', userController.loginUser)
router.post('/logout', userController.logOut)



/////////////
router.post('/createEvent', eventController.createEvent)
router.get('/eventDetails/:eventId', eventController.getEventById)
router.get('/events', eventController.getEvent)
router.put('/updateEvent/:eventId', eventController.updateEvent)





module.exports=router