const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userid: String,
    uuid: String,
    userdata: String,
    guilds: String
})

module.exports = mongoose.model('users', profileSchema)