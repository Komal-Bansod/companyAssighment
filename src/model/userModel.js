const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ["Mr", "Miss", " Mrs"]
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPassword: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);