const mongoose = require('mongoose')
const Schema = mongoose.Schema
var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    userId: {
        type: String,
        unique: true,
        required: true
    },
})

module.exports = mongoose.model('User', UserSchema)