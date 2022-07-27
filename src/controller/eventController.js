const eventModel = require('../model/eventModel')
const userModel = require('../model/userModel')
const mongoose = require('mongoose')



const isValid = function (value) {
  if (typeof value == undefined || value == null || value.length == 0) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true

}
const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}


const createEvent = async function (req, res) {

  let data = req.body
  const { eventName, description, eventDate, createdBy, invitees } = data

  if (!isValidRequestBody(data)) {
    return res.status(400).send({ status: false, message: 'body not empty' })
  }
  if (!isValid(eventName)) {
    return res.status(400).send({ status: false, msg: "eventName is Required" })
  }

  if (!isValid(createdBy)) {
    return res.status(400).send({ status: false, msg: "createdBy is Required" })
  }
  const allInvaitees = await userModel.find().select({ email: 1, _id: 0 })

  let arr = []
  for (let i = 0; i < allInvaitees.length; i++) {
    if (allInvaitees[i]) {
      arr.push(allInvaitees[i].email)

    }
  }
  console.log(arr)

  const finalData = await eventModel.create({ eventName, description, eventDate: Date.now(), createdBy, invitees: arr })

  return res.status(201).send(finalData)
}


const getEventById = async function (req, res) {
  let eventId = req.params.eventId

  if (!isValid(eventId)) {
    return res.status(400).send({ status: false, message: "Please , provide eventId in path params" })

  }
  if (!isValidObjectId(eventId)) {
    return res.status(400).send({ status: false, msg: 'please provide a valid eventId' })
  }
  console.log(eventId)
  const findEvent = await eventModel.findById({ _id: eventId })
  console.log(findEvent)
  return res.status(200).send({ status: true, data: findEvent })

}


const getEvent = async function (req, res) {
  const getData = req.query
  const { eventName, sortData } = getData
  let filter = {}
  if (eventName) {
    let newOne = await eventModel.find().select({ eventName: 1, _id: 0 })
    let arr = []
    for (let i = 0; i < newOne.length; i++) {
      let element = newOne[i].eventName
      let checkVar = element.includes(eventName)

      if (checkVar) {
        arr.push(newOne[i].eventName)

      }
      console.log(arr)

    }
    filter['eventName'] = arr
    let findData = await eventModel.find(filter)

    return res.status(200).send({ status: true, data: findData })
  }

  if (sortData == 1) {
    const sortedData = await eventModel.find().sort({ eventName: 1 })
    return res.send({ data: sortedData })
  }
  if (sortData == -1) {
    const sortedData = await eventModel.find().sort({ eventName: -1 })
    return res.send({ data: sortedData })
  }

  let page = req.query.page
  let limit = 10;
  const pages = await eventModel.find().skip((page * limit) - limit).limit(limit)

  return res.status(200).send(pages)


}



const updateEvent = async function (req, res) {

  try {
    let eventId = req.params.eventId
    const data = req.body
    console.log(eventId)

    if (!isValid(eventId)) {
      return res.status(400).send({ status: false, message: "Please , provide eventId in path params" })

    }
    if (!isValidObjectId(eventId)) {
      return res.status(400).send({ status: false, msg: 'please provide a valid eventId' })
    }

    const { eventName } = data
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: 'body not empty' })
    }
    if (!isValid(eventName)) {
      return res.status(400).send({ status: false, message: 'please provide eventName' })

    }

    const duplicateTitle = await eventModel.findOne({ eventName: eventName })
    if (duplicateTitle) {
      return res.status(400).send({ status: false, message: "This event already in use ,please provide another one" })

    }

    const updateData = { eventName: eventName }

    const updatedEvent = await eventModel.findOneAndUpdate({ _id: eventId }, updateData, { new: true })

    return res.status(200).send({ status: true, message: "event updated successfully", data: updatedEvent })
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports = { createEvent, getEventById, getEvent, updateEvent }
