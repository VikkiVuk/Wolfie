const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqNumber = {
    type: Number,
    required: true
}

const profileSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    tvojaLozinka: reqString
})

module.exports = mongoose.model('tvojbroj', profileSchema)