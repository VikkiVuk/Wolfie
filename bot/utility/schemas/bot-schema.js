const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    customShopItems: String
})

module.exports = mongoose.model('bot-stuff', profileSchema)