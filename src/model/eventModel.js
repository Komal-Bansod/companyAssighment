const mongoose = require('mongoose')
const userModel = require('./userModel')


const ObjectId = mongoose.Schema.Types.ObjectId
const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true

    },
    description: {
        type: String
    },
    eventDate: {
        type: Date,
        default: Date.now()

    },
    createdBy: {
        type: String,
        required: true

    },
    invitees: {
        type: [String]
    },

    isDeleted: {
    type: Boolean,
    defult: false
}
  },  { timestamp: true });
module.exports = mongoose.model('Event', eventSchema);