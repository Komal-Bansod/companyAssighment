const mongoose= require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId
const tokenSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});
module.exports = mongoose.model("Token", tokenSchema);