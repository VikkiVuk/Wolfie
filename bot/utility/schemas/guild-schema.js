const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    guildId: String,
    config: String,
    customitems: String,
    commandsOn: Array,
    commandOptions: Array
})

module.exports = mongoose.model('guilds', profileSchema)