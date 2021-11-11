const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    guildId: String,
    config: Array,
    commandsOn: Array,
    commandOptions: Array
})

module.exports = mongoose.model('guilds', profileSchema)