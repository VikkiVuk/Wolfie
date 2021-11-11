const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    guildid: String,
    userid: String,
    uuid: String,
    money: Number,
    inventory: String,
    xp: Number,
    level: Number,
    note: String,
    messages: String,
    daily: Date,
    warns: Number
})

module.exports = mongoose.model('users', profileSchema)