const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    discordTag: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    guilds: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("web-users", schema)