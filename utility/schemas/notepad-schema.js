const mongoose = require('mongoose')

const NotepadSchema = new mongoose.Schema({
    id: String,
    fnote: String
})

module.exports = mongoose.model('Notepad', NotepadSchema)