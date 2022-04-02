const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userid: String,
    authid: String,
    userdata: String,
    guilds: String,
    accountId: String
})

module.exports = mongoose.model('users', profileSchema)