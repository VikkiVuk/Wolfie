const mongoose = require('mongoose')
const { mongoPath } = require('../config.json')

module.exports = async () => {
    try {
        await mongoose.connect(mongoPath, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        return mongoose
    } catch(e) {
        console.error(e)
    }
}