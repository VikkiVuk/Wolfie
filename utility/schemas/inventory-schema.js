const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const profileSchema = mongoose.Schema({
    userId: reqString,
    items: reqString
})

module.exports = mongoose.model('inventory', profileSchema)