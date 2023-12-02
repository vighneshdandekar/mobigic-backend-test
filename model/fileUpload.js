

const mongoose = require('mongoose')
const Schema = mongoose.Schema
var fileScheme = new Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    fileId: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Userfile', fileScheme)