const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const profileSchema = new mongoose.Schema({
    id: reqString,
    temp_secret: reqString,
    secret: reqString
})

module.exports = mongoose.model('2fa', profileSchema)