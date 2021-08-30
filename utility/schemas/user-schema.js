const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userid: String,
    money: Number,
    inventory: String,
    xp: Number,
    level: Number,
    note: String
})

module.exports = mongoose.model('users', profileSchema)