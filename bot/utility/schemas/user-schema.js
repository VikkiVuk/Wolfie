const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userid: String,
    authid: String,
    userdata: String,
    guilds: String,
    VikkiVukAccountID: String
})

module.exports = mongoose.model('users', profileSchema)